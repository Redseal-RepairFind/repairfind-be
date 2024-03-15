import { Schema, model, Document, Types } from 'mongoose';

export enum TeamInvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export interface ITeamInvitation extends Document {
    contractor: Types.ObjectId;
    team: Types.ObjectId;
    role: string;
    status: TeamInvitationStatus;
}

const TeamInvitationSchema = new Schema<ITeamInvitation>(
    {
        contractor: {
            type: Schema.Types.ObjectId,
            ref: 'contractors',
            required: true,
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: 'contractor_teams',
            required: true,
        },
        role: {
            type: String,
            default: 'member', // Default role when inviting new members
        },
        status: {
            type: String,
            enum: Object.values(TeamInvitationStatus),
            default: TeamInvitationStatus.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

const TeamInvitationModel = model<ITeamInvitation>('contractor_team_invitations', TeamInvitationSchema);

export default TeamInvitationModel;
