"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TeamMemberStatus;
(function (TeamMemberStatus) {
    TeamMemberStatus["PENDING"] = "PENDING";
    TeamMemberStatus["ACTIVE"] = "ACTIVE";
    TeamMemberStatus["SUSPENDED"] = "SUSPENDED";
})(TeamMemberStatus || (TeamMemberStatus = {}));
var TeamSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    members: [
        {
            contractor: {
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
        },
    ],
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true,
    },
}, {
    timestamps: true,
});
var ContractorTeamModel = (0, mongoose_1.model)('contractor_teams', TeamSchema);
exports.default = ContractorTeamModel;
