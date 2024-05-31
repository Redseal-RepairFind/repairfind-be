

import { NextFunction, Request, Response } from 'express';
import ContractorTeamModel, { IContractorTeam } from '../../../database/contractor/models/contractor_team.model';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';
import { validationResult } from 'express-validator';
import { EmailService } from '../../../services';
import { NewTeamInvitationEmail } from '../../../templates/contractorEmail/team_invitation_email.template';
import { IContractor } from '../../../database/contractor/interface/contractor.interface';
import { InternalServerError } from '../../../utils/custom.errors';
import { RemovedFromTeamEmail } from '../../../templates/contractorEmail/team_removal_email.template';




export const getTeam = async (req: any, res: Response) => {
    try {
        const contractorId = req.contractor.id;

        // Check if the contractor is valid and is a Company Type
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor || contractor.accountType !== "Company") {
            return res.status(400).json({ success: false, message: "Only Company can retrieve team information" });
        }

        // Check if the company has a team
        let companyTeam = await ContractorTeamModel.findOne({
            contractor: contractorId,
        })
            .populate({
                path: "members.contractor",
                // select: "id firstName lastName email name profilePhoto ",
            })
            .exec();

        if (!companyTeam) {
            companyTeam = await ContractorTeamModel.create({
                contractor: contractorId,
                name: contractor.name
            });
        }

        res.json({
            success: true,
            message: "Team information retrieved successfully",
            data: {
                id: companyTeam.id,
                name: companyTeam.name,
                profilePhoto: contractor.profilePhoto.url,
                members: companyTeam.members.map((member: any) => ({
                    id: member.contractor.id,
                    firstName: member.contractor.firstName, // deprecate
                    lastName: member.contractor.lastName,
                    name: member.contractor.name,
                    profilePhoto: member.contractor.profilePhoto,
                    email: member.contractor.email,
                    role: member.role,
                    status: member.status,
                })),
            },
        });
    } catch (error) {
        console.error("Error retrieving team information:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getTeamMembers = async (req: any, res: Response) => {
    try {
        const contractorId = req.contractor.id;
        const { email } = req.query;

        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor || contractor.accountType !== "Company") {
            return res.status(400).json({ success: false, message: "Only companies can retrieve team information" });
        }

        let companyTeam = await ContractorTeamModel.findOne({ contractor: contractorId });

        if (!companyTeam) {
            return res.status(400).json({ success: false, message: "Team not found" });
        }

        let contractorIds = companyTeam.members.map((team: any) => team.contractor);
        let filter: any = { _id: { $in: contractorIds } };

        if (email) {
            filter.email = email;
        }

        const contractors = await ContractorModel.find(filter).populate('profile');

        res.json({
            success: true,
            message: "Team members retrieved successfully",
            data: contractors,
        });
    } catch (error) {
        console.error("Error retrieving team information:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
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
        let companyTeam = await ContractorTeamModel.findOne({
            'contractor': contractorId
        });

        if (!companyTeam) {
            companyTeam = await ContractorTeamModel.create({
                contractor: contractorId,
                name: contractor.firstName
            });
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



export const getInvitations = async (req: any, res: Response) => {
    try {
        const memberId = req.contractor.id;
        const { status } = req.query;

        // Find invitations for the member across all teams
        let invitations = await ContractorTeamModel.find({
            'members.contractor': memberId,
        });

        if (!invitations || invitations.length === 0) {
            return res.json({ success: true, message: 'No invitations found', data: [] });
        }

        // Flatten the invitations array and filter by status if provided
        let allInvitations: any[] = [];
        invitations.forEach((team: any) => {
            allInvitations = allInvitations.concat(team.members);
        });

        if (status) {
            allInvitations = allInvitations.filter((invitation: any) => invitation.status === status);
        }

        res.json({ success: true, message: 'Invitations retrieved successfully', data: allInvitations });
    } catch (error) {
        console.error('Error retrieving invitations:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};




export const getTeamMemberships = async (req: any, res: Response) => {
    try {
        const userId = req.contractor.id;

        // Find all teams where the user is a member
        const teams = await ContractorTeamModel.find({ 'members.contractor': userId });

        const formattedTeams = await Promise.all(teams.map(async (team: IContractorTeam) => {
            const userMembership = team.members.find(member => String(member.contractor) === userId);
            const contractor = <IContractor>await ContractorModel.findById(team.contractor);
            const contractorMember = <IContractor>await ContractorModel.findById(userMembership?.contractor);

            // Extract contractor details
            const formattedContractor = {
                id: contractorMember._id,
                name: contractorMember.name,
                email: contractorMember.email,
                profilePhoto: contractorMember.profilePhoto,
            };

            const formattedTeam = {
                id: team._id,
                name: team.name,
                email: contractor.email,
                profilePhoto: contractor.profilePhoto,
            };

            return {
                // id: team._id,
                team: formattedTeam,
                contractor: formattedContractor,
                role: userMembership?.role || 'Member',
                status: userMembership?.status || 'ACTIVE', // Assuming default status is ACTIVE
                dateJoined: userMembership?.dateJoined, // Assuming default status is ACTIVE
            };
        }));

        res.json({ success: true, message: 'Team memberships retrieved successfully', data: formattedTeams });
    } catch (error) {
        console.error('Error retrieving team memberships:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



export const leaveTeam = async (req: any, res: Response) => {
    try {
        const contractorId = req.contractor.id;
        const teamId = req.params.teamId;

        // Find the team
        const team = await ContractorTeamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        // Find the index of the member in the team's members array
        const memberIndex = team.members.findIndex(member => member.contractor.equals(contractorId));
        if (memberIndex === -1) {
            return res.status(404).json({ success: false, message: 'Member not found in the team' });
        }

        // Remove the member from the team
        team.members.splice(memberIndex, 1);

        // Save the updated team
        await team.save();

        res.json({ success: true, message: 'Contractor successfully left the team' });
    } catch (error) {
        console.error('Error leaving team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const removeMemberFromTeam = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const memberId = req.body.memberId;
        const teamId = req.params.teamId;

        // Find the team
        const team = await ContractorTeamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        // Check if the requester is the owner of the team
        if (team.contractor.toString() !== contractorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to remove members from this team' });
        }

        // Find the member in the team's members array
        const member = team.members.find(member => member.contractor.equals(memberId));
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found in the team' });
        }

        //TODO: Make some checks to ensure member is not assigned to any active job

        // Send email notification to the removed member
        const removedContractor = await ContractorModel.findById(memberId);
        if (removedContractor) {
            const htmlContent = RemovedFromTeamEmail(removedContractor.name, team.name);
            await EmailService.send(removedContractor.email, 'Removed from Team', htmlContent);
        }

        // Remove the member from the team
        team.members = team.members.filter(member => !member.contractor.equals(memberId));

        // Save the updated team
        await team.save();

        res.json({ success: true, message: 'Member successfully removed from the team' });
    } catch (error: any) {
        next(new InternalServerError('An error occurred removing team member', error));
    }
};




export const TeamController = {
    getTeam,
    searchContractorsNotInTeam,
    getTeamMemberships,
    leaveTeam,
    removeMemberFromTeam,
    getTeamMembers
}

