import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';
import TeamInvitationModel, { ITeamInvitation, TeamInvitationStatus } from '../../../database/contractor/models/contractor_team_invitation.model';
import ContractorTeamModel, { IContractorTeam, TeamMemberStatus } from '../../../database/contractor/models/contractor_team.model';
import { NewTeamInvitationEmail } from '../../../templates/contractorEmail/team_invitation_email.template';
import { EmailService } from '../../../services';
import { IContractor } from '../../../database/contractor/interface/contractor.interface';

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
            //@ts-ignore
              team = await ContractorTeamModel.create({ name: company.name, contractor: company.id, members: [] });
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
            status: { $in: [TeamInvitationStatus.PENDING, TeamInvitationStatus.ACCEPTED, TeamInvitationStatus.REJECTED] }
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
        const invitations = await TeamInvitationModel.find({ contractor }).populate([
            {path: 'contractor'},
            {path: 'team'},
        ]).exec();

        // const format = invitations.mao
        
        const formattedInvitations = await Promise.all(invitations.map(async (invitation: ITeamInvitation) => {
            // const userMembership = team.members.find(member => String(member.contractor) === userId);

            let team = await ContractorTeamModel.findById(invitation.team)
            const contractor = <IContractor> await ContractorModel.findById(invitation.contractor);
            const company = <IContractor> await ContractorModel.findById(team?.contractor);
    
            // Extract contractor details
            const formattedCompany = {
              id: company._id,
              // @ts-ignore
              name: company.name,
              email: company.email,
              profilePhoto: company.profilePhoto,
            };
      
            return {
              id: invitation._id,
              // @ts-ignore
              name: contractor?.name,
              email: contractor.email,
              profilePhoto: contractor.profilePhoto,
              team: formattedCompany,
              role: invitation?.role || 'Member',
              status: invitation?.status || 'ACTIVE', // Assuming default status is ACTIVE
            };
          }));
  
          


        res.json({ success: true, message: 'Invitations retrieved successfully', data: formattedInvitations });
    } catch (error) {
        console.error('Error retrieving invitations:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Controller method to accept an invitation
// Controller method to accept an invitation
export const acceptInvitation = async (req: Request, res: Response) => {
    try {
        const invitationId = req.params.invitationId;

        // Find the invitation by ID
        const invitation = await TeamInvitationModel.findById(invitationId);
        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        if (invitation.status === TeamInvitationStatus.ACCEPTED) {
            // Optionally return a message here if the invitation is already accepted
            return res.status(400).json({ success: false, message: 'Invitation is already accepted' });
        }

        if (invitation.status === TeamInvitationStatus.REJECTED) {
            return res.status(400).json({ success: false, message: 'Invitation is already rejected' });
        }

        invitation.status = TeamInvitationStatus.ACCEPTED;

        // Find the team
        const team = await ContractorTeamModel.findById(invitation.team);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        // Check if the contractor is already a member of the team
        const existingMemberIndex = team.members.findIndex(member => member.contractor.equals(invitation.contractor));

        // If contractor doesn't exist in the array, add a new member; otherwise, update the existing member
        if (existingMemberIndex === -1) {
            team.members.push({ contractor: invitation.contractor, role: invitation.role, status: TeamMemberStatus.ACTIVE, dateJoined: new Date() });
        } else {
            const update = {
                contractor: invitation.contractor,
                role: invitation.role,
                status: TeamMemberStatus.ACTIVE,
                dateJoined: new Date()
            };

            // Update the existing member in the array
            team.members[existingMemberIndex] = { ...team.members[existingMemberIndex], ...update };
        }

        // Save changes to the team and the invitation
        await Promise.all([team.save(), invitation.save()]);

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
