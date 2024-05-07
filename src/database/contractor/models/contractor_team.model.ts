import { Schema, model, Document, Types } from 'mongoose';

interface IContractorTeamMember {
  contractor: Types.ObjectId;
  role: string; // 'admin', 'member', etc.
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  dateJoined: Date;
}

export interface IContractorTeam extends Document {
  name: string;
  members: IContractorTeamMember[];
  contractor: Types.ObjectId; // Reference to the contractor who owns the team
}

enum TeamMemberStatus {
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
        dateJoined: {
          type: Date,
          default: Date.now,
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

export { ContractorTeamModel as default, TeamMemberStatus };
