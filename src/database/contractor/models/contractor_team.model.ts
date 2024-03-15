import { Schema, model, Document, Types } from 'mongoose';

interface ITeamMember {
  contractor: Types.ObjectId;
  role: string; // 'admin', 'member', etc.
  // status: TeamMemberStatus; // 'PENDING', 'ACTIVE', SUSPENDED.
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
}

export interface IContractorTeam extends Document {
  name: string;
  members: ITeamMember[];
  contractor: Types.ObjectId; // Reference to the contractor who owns the team
}

export enum TeamMemberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

const TeamSchema = new Schema<IContractorTeam>(
  {
    name: {
      type: String,
    },
    members: [
      {
        contractor: {
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
    ],
    contractor: {
      type: Schema.Types.ObjectId,
      ref: 'contractors',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ContractorTeamModel = model<IContractorTeam>('contractor_teams', TeamSchema);

export default ContractorTeamModel;
