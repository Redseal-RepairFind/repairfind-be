import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';
import TeamInvitationModel, { ITeamInvitation, TeamMemberStatus } from '../../../database/contractor/models/contractor_invitation.model';
import ContractorTeamModel, { IContractorTeam } from '../../../database/contractor/models/contractor_team.model';
import { NewTeamInvitationEmail } from '../../../templates/contractorEmail/team_invitation_email.template';
import { EmailService } from '../../../services';

// Controller method to invite a user to join a team
export const inviteToTeam = async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
        }

        const { contractorId, role } = req.body;
        const contractorCompany = req.contractor.id;

        // Check if the inviter is a valid contractor
        const company = await ContractorModel.findById(contractorCompany);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // Check if the invitee is a valid contractor
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        // Check if the invitee is already part of any team
        const existingInvitation = await TeamInvitationModel.findOne({
            contractor: contractor.id,
            company: company.id,
            status: { $in: [TeamMemberStatus.PENDING, TeamMemberStatus.ACTIVE] }
        });
        if (existingInvitation) {

           
            if(existingInvitation.status == TeamMemberStatus.PENDING){
                //resend invitation
                const htmlContent = NewTeamInvitationEmail(contractor.firstName, company.companyName);
                await EmailService.send(contractor.email, 'Team Invitation Reminder', htmlContent);
            }

            return res.status(400).json({ success: false, message: 'Invitee is already invited' });
        }

         // Check if the team exists
         let team: IContractorTeam | null = await ContractorTeamModel.findOne({ contractor: company.id });
         if (!team) {
             // Create a new team if it doesn't exist
             team = await ContractorTeamModel.create({ name: 'Default Team', contractor: company.id, members: [] });
         }

         

        // Create a new team invitation
        const newInvitation: ITeamInvitation = await TeamInvitationModel.create({
            contractor: contractor.id,
            company: company.id,
            role,
            status: TeamMemberStatus.PENDING,
        });

        res.status(201).json({ success: true, message: 'Invitation sent successfully', data: newInvitation });
    } catch (error) {
        console.error('Error inviting to team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Controller method to get all invitations for a contractor
export const getInvitations = async (req: any, res: Response) => {
    try {
        const contractor = req.contractor.id;

        // Get all invitations for the invitee
        const invitations = await TeamInvitationModel.find({ contractor }).populate('contractor').exec();

        res.json({ success: true, message: 'Invitations retrieved successfully', data: invitations });
    } catch (error) {
        console.error('Error retrieving invitations:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Controller method to accept an invitation
export const acceptInvitation = async (req: Request, res: Response) => {
    try {
        const invitationId = req.params.invitationId;

        // Find the invitation by ID
        const invitation = await TeamInvitationModel.findById(invitationId);
        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        // Update the invitation status to ACTIVE
        invitation.status = TeamMemberStatus.ACTIVE;

        // TODO: push to Team members array
        await invitation.save();

         // Find the team
         const team = await ContractorTeamModel.findOne({ contractor: invitation.company });
         if (!team) {
             return res.status(404).json({ success: false, message: 'Team not found' });
         }

        // Add contractor to team members
        team.members.push({ contractor: invitation.contractor, role: invitation.role, status: TeamMemberStatus.ACTIVE });
        await team.save();

        res.json({ success: true, message: 'Invitation accepted successfully', data: invitation });
    } catch (error) {
        console.error('Error accepting invitation:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Controller method to reject an invitation
export const rejectInvitation = async (req: Request, res: Response) => {
    try {
        const invitationId = req.params.invitationId;

        // Find the invitation by ID and remove it
        const deletedInvitation = await TeamInvitationModel.findByIdAndDelete(invitationId);
        
        if (!deletedInvitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

          // TODO: remove to Team members array

        res.json({ success: true, message: 'Invitation rejected successfully', data: deletedInvitation });
    } catch (error) {
        console.error('Error rejecting invitation:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const TeamInvitationController = {
    inviteToTeam,
    getInvitations,
    acceptInvitation,
    rejectInvitation,
};
