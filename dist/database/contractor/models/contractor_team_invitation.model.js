"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamInvitationStatus = void 0;
var mongoose_1 = require("mongoose");
var TeamInvitationStatus;
(function (TeamInvitationStatus) {
    TeamInvitationStatus["PENDING"] = "PENDING";
    TeamInvitationStatus["ACCEPTED"] = "ACCEPTED";
    TeamInvitationStatus["REJECTED"] = "REJECTED";
})(TeamInvitationStatus || (exports.TeamInvitationStatus = TeamInvitationStatus = {}));
var TeamInvitationSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true,
    },
    team: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
var TeamInvitationModel = (0, mongoose_1.model)('contractor_team_invitations', TeamInvitationSchema);
exports.default = TeamInvitationModel;
