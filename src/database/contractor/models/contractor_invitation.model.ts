import { Schema, model, Document, Types } from 'mongoose';

export enum TeamMemberStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export interface ITeamInvitation extends Document {
    contractor: Types.ObjectId;
    company: Types.ObjectId;
    role: string;
    status: TeamMemberStatus;
}

const TeamInvitationSchema = new Schema<ITeamInvitation>(
    {
        contractor: {
            type: Schema.Types.ObjectId,
            ref: 'contractors',
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'contractors',
            required: true,
        },
        role: {
            type: String,
            default: 'member', // Default role when inviting new members
        },
        status: {
            type: String,
            enum: Object.values(TeamMemberStatus),
            default: TeamMemberStatus.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

const TeamInvitationModel = model<ITeamInvitation>('team_invitations', TeamInvitationSchema);

export default TeamInvitationModel;
