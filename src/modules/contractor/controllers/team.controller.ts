

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


        // Ensure that the member being invited has an Individual or Employee account type
        const member = await ContractorModel.findById(memberId);
        if (!member || member.accountType !== 'Individual' && member.accountType !== 'Employee') {
            return res.status(400).json({ success: false, message: 'Invalid contractor or contractor type. Only Individual and Employee types can be invited to a team.' });
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

        // Check if the member is already part of any team with 'PENDING' or 'ACTIVE' status
        const existingTeamMember = await ContractorTeamModel.findOne({
            'members.contractor': memberId,
            'members.status': { $in: ['PENDING', 'ACTIVE'] },
        });

        
        if (existingTeamMember) {
            // Check if any member in the team has 'ACTIVE' status
            const isActiveMember = existingTeamMember.members.some(member => member.status === 'ACTIVE');

            if (isActiveMember) {
                return res.json({ success: true, message: 'Contractor is already part of an active team'});
            } else {
                
                // Resend the invitation email to all existing team members
                const resendInvitations = existingTeamMember.members.map(async (teamMember) => {
                    const htmlContent = NewTeamInvitationEmail(member.firstName, contractor.companyName);
                    await EmailService.send(member.email, 'Team Invitation Reminder', htmlContent);
                });
                console.log(member, contractor)
                await Promise.all(resendInvitations);
                return res.json({ success: true, message: 'Invitations resent successfully'});
            }
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
        const htmlContent = NewTeamInvitationEmail(member.firstName, contractor.companyName);
        EmailService.send(member.email, 'New Team Invitation', htmlContent)
            .then(() => console.log('Email sent successfully'))
            .catch(error => console.error('Error sending email:', error));

        res.json({ success: true, message: 'Invitation sent successfully' });
    } catch (error) {
        console.error('Error inviting to team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getTeam = async (req: any, res: Response) => {
    try {
        const contractorId = req.contractor.id;

        // Check if the contractor is valid and is a Company Type
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor || contractor.accountType !== 'Company') {
            return res.status(400).json({ success: false, message: 'Only Company can retrieve team information' });
        }

        // Check if the company has a team
        const companyTeam = await ContractorTeamModel.findOne({
            'contractor': contractorId
        }).populate('members.contractor');

        if (!companyTeam) {
            return res.json({ success: true, message: 'Company does not have a team', data: null });
        }

        res.json({ success: true, message: 'Team information retrieved successfully', data: companyTeam });
    } catch (error) {
        console.error('Error retrieving team information:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const searchContractorsNotInTeam = async (req: any, res: Response) => {
    try {
        const contractorId = req.contractor.id;

        // Check if the contractor is valid and is a Company Type
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor || contractor.accountType !== 'Company') {
            return res.status(400).json({ success: false, message: 'Only Company can perform this operation' });
        }

        // Get the company's team
        const companyTeam = await ContractorTeamModel.findOne({
            'contractor': contractorId
        });

        if (!companyTeam) {
            return res.json({ success: true, message: 'Company does not have a team', data: [] });
        }

        // Get the search parameters (name and email)
        const { name, email } = req.query;

        // Define the search criteria based on name and email
        const searchCriteria: any = {
            accountType: { $in: ['Individual', 'Employee'] },
            _id: { $nin: companyTeam.members.map(member => member.contractor) }
        };

        if (name) {
            // Case-insensitive search by name
            searchCriteria.$or = [
                { firstName: { $regex: new RegExp(name, 'i') } },
                { lastName: { $regex: new RegExp(name, 'i') } }
            ];
        }

        if (email) {
            // Case-insensitive search by email
            searchCriteria.email = { $regex: new RegExp(email, 'i') };
        }

        // Get contractors with type "Individual" and "Employee" who are not in any team and match the search criteria
        const contractorsNotInTeam = await ContractorModel.find(searchCriteria);

        res.json({ success: true, message: 'Contractors not in any team retrieved successfully', data: contractorsNotInTeam });
    } catch (error) {
        console.error('Error searching for contractors not in any team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};







export const TeamController = {
    inviteToTeam,
    getTeam,
    searchContractorsNotInTeam
}

