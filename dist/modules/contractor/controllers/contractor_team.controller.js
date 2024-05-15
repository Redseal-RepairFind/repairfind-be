"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = exports.removeMemberFromTeam = exports.leaveTeam = exports.getTeamMemberships = exports.getInvitations = exports.searchContractorsNotInTeam = exports.getTeam = void 0;
var contractor_team_model_1 = __importDefault(require("../../../database/contractor/models/contractor_team.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var services_1 = require("../../../services");
var custom_errors_1 = require("../../../utils/custom.errors");
var team_removal_email_template_1 = require("../../../templates/contractorEmail/team_removal_email.template");
var getTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, contractor, companyTeam, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _a.sent();
                if (!contractor || contractor.accountType !== "Company") {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Only Company can retrieve team information" })];
                }
                return [4 /*yield*/, contractor_team_model_1.default.findOne({
                        contractor: contractorId,
                    })
                        .populate({
                        path: "members.contractor",
                        // select: "id firstName lastName email name profilePhoto ",
                    })
                        .exec()];
            case 2:
                companyTeam = _a.sent();
                if (!!companyTeam) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_team_model_1.default.create({
                        contractor: contractorId,
                        name: contractor.name
                    })];
            case 3:
                companyTeam = _a.sent();
                _a.label = 4;
            case 4:
                res.json({
                    success: true,
                    message: "Team information retrieved successfully",
                    data: {
                        id: companyTeam.id,
                        name: companyTeam.name,
                        profilePhoto: contractor.profilePhoto.url,
                        members: companyTeam.members.map(function (member) { return ({
                            id: member.contractor.id,
                            firstName: member.contractor.firstName, // deprecate
                            lastName: member.contractor.lastName,
                            name: member.contractor.name,
                            profilePhoto: member.contractor.profilePhoto,
                            email: member.contractor.email,
                            role: member.role,
                            status: member.status,
                        }); }),
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error("Error retrieving team information:", error_1);
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getTeam = getTeam;
var searchContractorsNotInTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, contractor, companyTeam, _a, name_1, email, searchCriteria, contractorsNotInTeam, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _b.sent();
                if (!contractor || contractor.accountType !== 'Company') {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Only Company can perform this operation' })];
                }
                return [4 /*yield*/, contractor_team_model_1.default.findOne({
                        'contractor': contractorId
                    })];
            case 2:
                companyTeam = _b.sent();
                if (!!companyTeam) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_team_model_1.default.create({
                        contractor: contractorId,
                        name: contractor.firstName
                    })];
            case 3:
                companyTeam = _b.sent();
                _b.label = 4;
            case 4:
                _a = req.query, name_1 = _a.name, email = _a.email;
                searchCriteria = {
                    accountType: { $in: ['Individual', 'Employee'] },
                    _id: { $nin: companyTeam.members.map(function (member) { return member.contractor; }) }
                };
                if (name_1) {
                    // Case-insensitive search by name
                    searchCriteria.$or = [
                        { firstName: { $regex: new RegExp(name_1, 'i') } },
                        { lastName: { $regex: new RegExp(name_1, 'i') } }
                    ];
                }
                if (email) {
                    // Case-insensitive search by email
                    searchCriteria.email = { $regex: new RegExp(email, 'i') };
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.find(searchCriteria)];
            case 5:
                contractorsNotInTeam = _b.sent();
                res.json({ success: true, message: 'Contractors not in any team retrieved successfully', data: contractorsNotInTeam });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                console.error('Error searching for contractors not in any team:', error_2);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.searchContractorsNotInTeam = searchContractorsNotInTeam;
var getInvitations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var memberId, status_1, invitations, allInvitations_1, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                memberId = req.contractor.id;
                status_1 = req.query.status;
                return [4 /*yield*/, contractor_team_model_1.default.find({
                        'members.contractor': memberId,
                    })];
            case 1:
                invitations = _a.sent();
                if (!invitations || invitations.length === 0) {
                    return [2 /*return*/, res.json({ success: true, message: 'No invitations found', data: [] })];
                }
                allInvitations_1 = [];
                invitations.forEach(function (team) {
                    allInvitations_1 = allInvitations_1.concat(team.members);
                });
                if (status_1) {
                    allInvitations_1 = allInvitations_1.filter(function (invitation) { return invitation.status === status_1; });
                }
                res.json({ success: true, message: 'Invitations retrieved successfully', data: allInvitations_1 });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error retrieving invitations:', error_3);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getInvitations = getInvitations;
var getTeamMemberships = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, teams, formattedTeams, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId_1 = req.contractor.id;
                return [4 /*yield*/, contractor_team_model_1.default.find({ 'members.contractor': userId_1 })];
            case 1:
                teams = _a.sent();
                return [4 /*yield*/, Promise.all(teams.map(function (team) { return __awaiter(void 0, void 0, void 0, function () {
                        var userMembership, contractor, contractorMember, formattedContractor, formattedTeam;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    userMembership = team.members.find(function (member) { return String(member.contractor) === userId_1; });
                                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(team.contractor)];
                                case 1:
                                    contractor = _a.sent();
                                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userMembership === null || userMembership === void 0 ? void 0 : userMembership.contractor)];
                                case 2:
                                    contractorMember = _a.sent();
                                    formattedContractor = {
                                        id: contractorMember._id,
                                        name: contractorMember.name,
                                        email: contractorMember.email,
                                        profilePhoto: contractorMember.profilePhoto,
                                    };
                                    formattedTeam = {
                                        id: team._id,
                                        name: team.name,
                                        email: contractor.email,
                                        profilePhoto: contractor.profilePhoto,
                                    };
                                    return [2 /*return*/, {
                                            // id: team._id,
                                            team: formattedTeam,
                                            contractor: formattedContractor,
                                            role: (userMembership === null || userMembership === void 0 ? void 0 : userMembership.role) || 'Member',
                                            status: (userMembership === null || userMembership === void 0 ? void 0 : userMembership.status) || 'ACTIVE', // Assuming default status is ACTIVE
                                            dateJoined: userMembership === null || userMembership === void 0 ? void 0 : userMembership.dateJoined, // Assuming default status is ACTIVE
                                        }];
                            }
                        });
                    }); }))];
            case 2:
                formattedTeams = _a.sent();
                res.json({ success: true, message: 'Team memberships retrieved successfully', data: formattedTeams });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error retrieving team memberships:', error_4);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTeamMemberships = getTeamMemberships;
var leaveTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId_1, teamId, team, memberIndex, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                contractorId_1 = req.contractor.id;
                teamId = req.params.teamId;
                return [4 /*yield*/, contractor_team_model_1.default.findById(teamId)];
            case 1:
                team = _a.sent();
                if (!team) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Team not found' })];
                }
                memberIndex = team.members.findIndex(function (member) { return member.contractor.equals(contractorId_1); });
                if (memberIndex === -1) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Member not found in the team' })];
                }
                // Remove the member from the team
                team.members.splice(memberIndex, 1);
                // Save the updated team
                return [4 /*yield*/, team.save()];
            case 2:
                // Save the updated team
                _a.sent();
                res.json({ success: true, message: 'Contractor successfully left the team' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Error leaving team:', error_5);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.leaveTeam = leaveTeam;
var removeMemberFromTeam = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, memberId_1, teamId, team, member, removedContractor, htmlContent, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                contractorId = req.contractor.id;
                memberId_1 = req.body.memberId;
                teamId = req.params.teamId;
                return [4 /*yield*/, contractor_team_model_1.default.findById(teamId)];
            case 1:
                team = _a.sent();
                if (!team) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Team not found' })];
                }
                // Check if the requester is the owner of the team
                if (team.contractor.toString() !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to remove members from this team' })];
                }
                member = team.members.find(function (member) { return member.contractor.equals(memberId_1); });
                if (!member) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Member not found in the team' })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(memberId_1)];
            case 2:
                removedContractor = _a.sent();
                if (!removedContractor) return [3 /*break*/, 4];
                htmlContent = (0, team_removal_email_template_1.RemovedFromTeamEmail)(removedContractor.name, team.name);
                return [4 /*yield*/, services_1.EmailService.send(removedContractor.email, 'Removed from Team', htmlContent)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                // Remove the member from the team
                team.members = team.members.filter(function (member) { return !member.contractor.equals(memberId_1); });
                // Save the updated team
                return [4 /*yield*/, team.save()];
            case 5:
                // Save the updated team
                _a.sent();
                res.json({ success: true, message: 'Member successfully removed from the team' });
                return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                next(new custom_errors_1.InternalServerError('An error occurred removing team member', error_6));
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.removeMemberFromTeam = removeMemberFromTeam;
exports.TeamController = {
    getTeam: exports.getTeam,
    searchContractorsNotInTeam: exports.searchContractorsNotInTeam,
    getTeamMemberships: exports.getTeamMemberships,
    leaveTeam: exports.leaveTeam,
    removeMemberFromTeam: exports.removeMemberFromTeam
};
