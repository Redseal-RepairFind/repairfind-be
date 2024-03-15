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
exports.TeamController = exports.getInvitations = exports.acceptTeamInvitation = exports.searchContractorsNotInTeam = exports.getTeam = exports.inviteToTeam = void 0;
var contractor_team_model_1 = __importDefault(require("../../../database/contractor/models/contractor_team.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var express_validator_1 = require("express-validator");
var services_1 = require("../../../services");
var team_invitation_email_template_1 = require("../../../templates/contractorEmail/team_invitation_email.template");
var inviteToTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, memberId, role, contractorId, errors, contractor_1, member_1, existingTeamForContractor, teamId, newTeam, existingTeamMember, isActiveMember, resendInvitations, updatedTeam, htmlContent, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                _a = req.body, memberId = _a.memberId, role = _a.role;
                contractorId = req.contractor.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor_1 = _b.sent();
                if (!contractor_1 || contractor_1.accountType !== 'Company') {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Only Company can create and manage teams' })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(memberId)];
            case 2:
                member_1 = _b.sent();
                if (!member_1 || member_1.accountType !== 'Individual' && member_1.accountType !== 'Employee') {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid contractor or contractor type. Only Individual and Employee types can be invited to a team.' })];
                }
                return [4 /*yield*/, contractor_team_model_1.default.findOne({
                        'contractor': contractorId
                    })];
            case 3:
                existingTeamForContractor = _b.sent();
                teamId = void 0;
                if (!existingTeamForContractor) return [3 /*break*/, 4];
                // If the contractor already has a team, use the existing team
                teamId = existingTeamForContractor._id;
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, contractor_team_model_1.default.create({
                    contractor: contractorId,
                    name: contractor_1.firstName
                })];
            case 5:
                newTeam = _b.sent();
                teamId = newTeam._id;
                _b.label = 6;
            case 6: return [4 /*yield*/, contractor_team_model_1.default.findOne({
                    'members.contractor': memberId,
                    'members.status': { $in: ['PENDING', 'ACTIVE'] },
                })];
            case 7:
                existingTeamMember = _b.sent();
                if (!existingTeamMember) return [3 /*break*/, 10];
                isActiveMember = existingTeamMember.members.some(function (member) { return member.status === 'ACTIVE'; });
                if (!isActiveMember) return [3 /*break*/, 8];
                return [2 /*return*/, res.json({ success: true, message: 'Contractor is already part of an active team' })];
            case 8:
                resendInvitations = existingTeamMember.members.map(function (teamMember) { return __awaiter(void 0, void 0, void 0, function () {
                    var htmlContent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                htmlContent = (0, team_invitation_email_template_1.NewTeamInvitationEmail)(member_1.firstName, contractor_1.companyName);
                                return [4 /*yield*/, services_1.EmailService.send(member_1.email, 'Team Invitation Reminder', htmlContent)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                console.log(member_1, contractor_1);
                return [4 /*yield*/, Promise.all(resendInvitations)];
            case 9:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, message: 'Invitations resent successfully' })];
            case 10: return [4 /*yield*/, contractor_team_model_1.default.findByIdAndUpdate(teamId, {
                    $addToSet: {
                        members: { contractor: member_1.id, role: role, status: 'PENDING' },
                    },
                }, { new: true })];
            case 11:
                updatedTeam = _b.sent();
                if (!updatedTeam) {
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Failed to update team' })];
                }
                htmlContent = (0, team_invitation_email_template_1.NewTeamInvitationEmail)(member_1.firstName, contractor_1.companyName);
                services_1.EmailService.send(member_1.email, 'New Team Invitation', htmlContent)
                    .then(function () { return console.log('Email sent successfully'); })
                    .catch(function (error) { return console.error('Error sending email:', error); });
                res.json({ success: true, message: 'Invitation sent successfully' });
                return [3 /*break*/, 13];
            case 12:
                error_1 = _b.sent();
                console.error('Error inviting to team:', error_1);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.inviteToTeam = inviteToTeam;
var getTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, contractor, companyTeam, error_2;
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
                        name: contractor.firstName
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
                error_2 = _a.sent();
                console.error("Error retrieving team information:", error_2);
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getTeam = getTeam;
var searchContractorsNotInTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, contractor, companyTeam, _a, name_1, email, searchCriteria, contractorsNotInTeam, error_3;
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
                error_3 = _b.sent();
                console.error('Error searching for contractors not in any team:', error_3);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.searchContractorsNotInTeam = searchContractorsNotInTeam;
var acceptTeamInvitation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var memberId, team, updatedTeam, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                memberId = req.contractor.id;
                return [4 /*yield*/, contractor_team_model_1.default.findOne({
                        'members.contractor': memberId,
                        'members.status': 'PENDING'
                    })];
            case 1:
                team = _a.sent();
                if (!team) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Invitation not found' })];
                }
                return [4 /*yield*/, contractor_team_model_1.default.findOneAndUpdate({
                        'members.contractor': memberId,
                        'members.status': 'PENDING'
                    }, {
                        $set: { 'members.$.status': 'ACTIVE' }
                    }, { new: true })];
            case 2:
                updatedTeam = _a.sent();
                if (!updatedTeam) {
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Failed to accept invitation' })];
                }
                res.json({ success: true, message: 'Invitation accepted successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error accepting team invitation:', error_4);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptTeamInvitation = acceptTeamInvitation;
var getInvitations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var memberId, status_1, invitations, allInvitations_1, error_5;
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
                error_5 = _a.sent();
                console.error('Error retrieving invitations:', error_5);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getInvitations = getInvitations;
exports.TeamController = {
    inviteToTeam: exports.inviteToTeam,
    getTeam: exports.getTeam,
    searchContractorsNotInTeam: exports.searchContractorsNotInTeam,
    acceptTeamInvitation: exports.acceptTeamInvitation
};
