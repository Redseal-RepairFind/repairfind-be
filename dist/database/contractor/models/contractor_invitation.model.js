"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberStatus = void 0;
var mongoose_1 = require("mongoose");
var TeamMemberStatus;
(function (TeamMemberStatus) {
    TeamMemberStatus["PENDING"] = "PENDING";
    TeamMemberStatus["ACTIVE"] = "ACTIVE";
    TeamMemberStatus["SUSPENDED"] = "SUSPENDED";
})(TeamMemberStatus || (exports.TeamMemberStatus = TeamMemberStatus = {}));
var TeamInvitationSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true,
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
var TeamInvitationModel = (0, mongoose_1.model)('team_invitations', TeamInvitationSchema);
exports.default = TeamInvitationModel;
