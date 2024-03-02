

import { Request, Response } from 'express';
import { Types } from 'mongoose';
import ContractorTeamModel, { IContractorTeam } from '../../../database/contractor/models/contractor_team.model';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';
import { validationResult } from 'express-validator';
import { htmlContractorDocumentValidatinTemplate } from '../../../templates/contractorEmail/contractorDocumentTemplate';
import { EmailService } from '../../../services';
import { NewTeamInvitationEmail } from '../../../templates/contractorEmail/team_invitation_email.template';


export const inviteToTeam = async (req: any, res: Response) => {
    try {
        const { memberId, role } = req.body;
        const contractorId = req.contractor.id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        // Check if the contractor is valid and is a Company Type
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor || contractor.accountType !== 'Company') {
            return res.status(400).json({ success: false, message: 'Only Company can create and manage teams' });
        }

        // Check if the contractor is valid and is a Company Type
        const member = await ContractorModel.findById(memberId);
        if (!member) {
            return res.status(400).json({ success: false, message: 'Invalid contractor or contractor type' });
        }

       
        // Check if the member is already part of any team with 'PENDING' status
        // const existingTeamMember = await ContractorTeamModel.findOne({
        //     'members.contractor': memberId,
        //     'members.status': 'PENDING',
        // });

        // if (existingTeamMember) {
        //     // Resend the invitation email to the existing team member
        //     const htmlContent = NewTeamInvitationEmail(member.firstName, existingTeamMember.name);
        //     EmailService.send(member.email, 'Resent Team Invitation', htmlContent)
        //         .then(() => console.log('Email sent successfully'))
        //         .catch(error => console.error('Error sending email:', error));

        //     return res.json({ success: true, message: 'Invitation resent successfully', data: existingTeamMember });
        // }

        // Check if the member is already part of any team with 'PENDING' or 'ACTIVE' status
        const existingTeamMember = await ContractorTeamModel.findOne({
            'members.contractor': memberId,
            'members.status': { $in: ['PENDING', 'ACTIVE'] },
        });

        if (existingTeamMember) {
            // Check if any member in the team has 'ACTIVE' status
            const isActiveMember = existingTeamMember.members.some(member => member.status === 'ACTIVE');

            if (isActiveMember) {
                return res.json({ success: true, message: 'Contractor is already part of an active team', data: existingTeamMember });
            } else {
                // Resend the invitation email to all existing team members
                const resendInvitations = existingTeamMember.members.map(async (teamMember) => {
                    const htmlContent = NewTeamInvitationEmail(member.firstName, existingTeamMember.name);
                    await EmailService.send(member.email, 'Team Invitation Reminder', htmlContent);
                });

                await Promise.all(resendInvitations);

                return res.json({ success: true, message: 'Invitations resent successfully', data: existingTeamMember });
            }
        }
        
        

        // Check if the contractor already has a team
        const existingTeamForContractor = await ContractorTeamModel.findOne({
            'contractor': contractorId
        });

        let teamId;
        if (existingTeamForContractor) {
            // If the contractor already has a team, use the existing team
            teamId = existingTeamForContractor._id;
        } else {
            // If the contractor doesn't have a team, create a new team
            const newTeam: IContractorTeam = await ContractorTeamModel.create({
                contractor: contractorId,
                name: contractor.firstName
            });

            teamId = newTeam._id;
        }

        // Add the contractor to the team
        const updatedTeam: IContractorTeam | null = await ContractorTeamModel.findByIdAndUpdate(
            teamId,
            {
                $addToSet: {
                    members: { contractor: member.id, role, status: 'PENDING' },
                },
            },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(500).json({ success: false, message: 'Failed to update team' });
        }

        // Send mail to the invited user
        const htmlContent = NewTeamInvitationEmail(member.firstName, updatedTeam.name);
        EmailService.send(member.email, 'New Team Invitation', htmlContent)
            .then(() => console.log('Email sent successfully'))
            .catch(error => console.error('Error sending email:', error));

        res.json({ success: true, message: 'Invitation sent successfully', data: updatedTeam });
    } catch (error) {
        console.error('Error inviting to team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};




export const TeamController = {
    inviteToTeam,
}

