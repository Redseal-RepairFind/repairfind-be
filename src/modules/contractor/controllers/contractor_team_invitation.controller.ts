import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';
import TeamInvitationModel, { ITeamInvitation, TeamInvitationStatus } from '../../../database/contractor/models/contractor_invitation.model';
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

          // Check if the team exists
          let team: IContractorTeam | null = await ContractorTeamModel.findOne({ contractor: company.id });
          if (!team) {
              team = await ContractorTeamModel.create({ name: 'Default Team', contractor: company.id, members: [] });
          }

          

        // Check if the invitee is a valid contractor
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        // Check if the invitee is already part of any team
        const existingInvitation = await TeamInvitationModel.findOne({
            contractor: contractor.id,
            team: team.id,
            status: { $in: [TeamInvitationStatus.PENDING, TeamInvitationStatus.ACTIVE, TeamInvitationStatus.REJECTED] }
        });
        if (existingInvitation) {

           
            if(existingInvitation.status == TeamInvitationStatus.PENDING){
                //resend invitation
                //@ts-ignore
                const htmlContent = NewTeamInvitationEmail(contractor.name, company.companyName);
                await EmailService.send(contractor.email, 'Team Invitation Reminder', htmlContent);
            }

            if(existingInvitation.status == TeamInvitationStatus.REJECTED){

                existingInvitation.status = TeamInvitationStatus.PENDING
                existingInvitation.role = role
                existingInvitation.save()

                //resend rejected invitation
                //@ts-ignore
                const htmlContent = NewTeamInvitationEmail(contractor.name, company.companyName);
                await EmailService.send(contractor.email, 'New Team Invitation', htmlContent);
            }

            return res.status(400).json({ success: false, message: 'Invitee is already invited' });
        }
  

        // Create a new team invitation
        const newInvitation: ITeamInvitation = await TeamInvitationModel.create({
            contractor: contractor.id,
            team: team.id,
            role,
            status: TeamInvitationStatus.PENDING,
        });

        const htmlContent = NewTeamInvitationEmail(contractor.firstName, company.companyName);
        EmailService.send(contractor.email, 'New Team Invitation', htmlContent)
        .then(() => console.log('Email sent successfully'))
        .catch(error => console.error('Error sending email:', error));

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

        if (invitation.status !== TeamInvitationStatus.PENDING) {
            return res.status(404).json({ success: false, message: 'Invitation is  is already accepted' });
        }

        // Update the invitation status to ACTIVE
        invitation.status = TeamInvitationStatus.ACTIVE;

        // TODO: push to Team members array
        await invitation.save();

         // Find the team
         const team = await ContractorTeamModel.findOne({ contractor: invitation.team });
         if (!team) {
             return res.status(404).json({ success: false, message: 'Team not found' });
         }

        // Add contractor to team members
        team.members.push({ contractor: invitation.contractor, role: invitation.role, status: TeamInvitationStatus.ACTIVE });
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
        const rejectedInvitation = await TeamInvitationModel.findById(invitationId)
        
        if (!rejectedInvitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        rejectedInvitation.status =TeamInvitationStatus.REJECTED
        rejectedInvitation.save()

        res.json({ success: true, message: 'Invitation rejected successfully', data: rejectedInvitation });
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
