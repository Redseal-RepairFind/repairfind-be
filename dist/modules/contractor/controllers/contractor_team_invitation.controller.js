"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamInvitationController = exports.rejectInvitation = exports.acceptInvitation = exports.getInvitations = exports.inviteToTeam = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractor_team_invitation_model_1 = __importStar(require("../../../database/contractor/models/contractor_team_invitation.model"));
var contractor_team_model_1 = __importStar(require("../../../database/contractor/models/contractor_team.model"));
var team_invitation_email_template_1 = require("../../../templates/contractorEmail/team_invitation_email.template");
var services_1 = require("../../../services");
// Controller method to invite a user to join a team
var inviteToTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, contractorId, role, inviterCompanyId, inviterCompany, team, invitee_1, existingMemberInTeam, existingInvitation, htmlContent_1, htmlContent_2, newInvitation, htmlContent, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                }
                _a = req.body, contractorId = _a.contractorId, role = _a.role;
                inviterCompanyId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(inviterCompanyId)];
            case 1:
                inviterCompany = _b.sent();
                if (!inviterCompany) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Inviter company not found' })];
                }
                return [4 /*yield*/, contractor_team_model_1.default.findOne({ contractor: inviterCompany.id })];
            case 2:
                team = _b.sent();
                if (!!team) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_team_model_1.default.create({ name: inviterCompany.name, contractor: inviterCompany.id, members: [] })];
            case 3:
                team = _b.sent();
                _b.label = 4;
            case 4: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 5:
                invitee_1 = _b.sent();
                if (!invitee_1) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Invitee contractor not found' })];
                }
                existingMemberInTeam = team.members.find(function (member) { return member.contractor.equals(invitee_1.id) && member.status === contractor_team_model_1.TeamMemberStatus.ACTIVE; });
                if (existingMemberInTeam) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitee is already a member of a team' })];
                }
                return [4 /*yield*/, contractor_team_invitation_model_1.default.findOne({
                        contractor: invitee_1.id,
                        team: team.id,
                        status: { $in: [contractor_team_invitation_model_1.TeamInvitationStatus.PENDING, contractor_team_invitation_model_1.TeamInvitationStatus.ACCEPTED, contractor_team_invitation_model_1.TeamInvitationStatus.REJECTED] }
                    })];
            case 6:
                existingInvitation = _b.sent();
                if (!existingInvitation) return [3 /*break*/, 12];
                if (!(existingInvitation.status === contractor_team_invitation_model_1.TeamInvitationStatus.PENDING)) return [3 /*break*/, 8];
                htmlContent_1 = (0, team_invitation_email_template_1.NewTeamInvitationEmail)(invitee_1.name, inviterCompany.companyName);
                return [4 /*yield*/, services_1.EmailService.send(invitee_1.email, 'Team Invitation Reminder', htmlContent_1)];
            case 7:
                _b.sent();
                return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitee is already invited' })];
            case 8:
                if (!(existingInvitation.status === contractor_team_invitation_model_1.TeamInvitationStatus.REJECTED)) return [3 /*break*/, 11];
                // Resend rejected invitation
                existingInvitation.status = contractor_team_invitation_model_1.TeamInvitationStatus.PENDING;
                existingInvitation.role = role;
                return [4 /*yield*/, existingInvitation.save()];
            case 9:
                _b.sent();
                htmlContent_2 = (0, team_invitation_email_template_1.NewTeamInvitationEmail)(invitee_1.name, inviterCompany.companyName);
                return [4 /*yield*/, services_1.EmailService.send(invitee_1.email, 'New Team Invitation', htmlContent_2)];
            case 10:
                _b.sent();
                return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitee is already invited' })];
            case 11: return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitee is already invited' })];
            case 12: return [4 /*yield*/, contractor_team_invitation_model_1.default.create({
                    contractor: invitee_1.id,
                    team: team.id,
                    role: role,
                    status: contractor_team_invitation_model_1.TeamInvitationStatus.PENDING,
                })];
            case 13:
                newInvitation = _b.sent();
                htmlContent = (0, team_invitation_email_template_1.NewTeamInvitationEmail)(invitee_1.firstName, inviterCompany.companyName);
                return [4 /*yield*/, services_1.EmailService.send(invitee_1.email, 'New Team Invitation', htmlContent)];
            case 14:
                _b.sent();
                res.status(201).json({ success: true, message: 'Invitation sent successfully', data: newInvitation });
                return [3 /*break*/, 16];
            case 15:
                error_1 = _b.sent();
                console.error('Error inviting to team:', error_1);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.inviteToTeam = inviteToTeam;
// Controller method to get all invitations for a contractor
var getInvitations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractor, invitations, formattedInvitations, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                contractor = req.contractor.id;
                return [4 /*yield*/, contractor_team_invitation_model_1.default.find({ contractor: contractor, status: contractor_team_invitation_model_1.TeamInvitationStatus.PENDING }).populate([
                        { path: 'contractor' },
                        { path: 'team' },
                    ]).exec()];
            case 1:
                invitations = _a.sent();
                return [4 /*yield*/, Promise.all(invitations.map(function (invitation) { return __awaiter(void 0, void 0, void 0, function () {
                        var team, contractor, company, formattedCompany;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, contractor_team_model_1.default.findById(invitation.team)];
                                case 1:
                                    team = _a.sent();
                                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(invitation.contractor)];
                                case 2:
                                    contractor = _a.sent();
                                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(team === null || team === void 0 ? void 0 : team.contractor)];
                                case 3:
                                    company = _a.sent();
                                    formattedCompany = {
                                        id: company._id,
                                        // @ts-ignore
                                        name: company.name,
                                        email: company.email,
                                        profilePhoto: company.profilePhoto,
                                    };
                                    return [2 /*return*/, {
                                            id: invitation._id,
                                            // @ts-ignore
                                            name: contractor === null || contractor === void 0 ? void 0 : contractor.name,
                                            email: contractor.email,
                                            profilePhoto: contractor.profilePhoto,
                                            team: formattedCompany,
                                            role: (invitation === null || invitation === void 0 ? void 0 : invitation.role) || 'Member',
                                            status: (invitation === null || invitation === void 0 ? void 0 : invitation.status) || 'ACTIVE', // Assuming default status is ACTIVE
                                        }];
                            }
                        });
                    }); }))];
            case 2:
                formattedInvitations = _a.sent();
                res.json({ success: true, message: 'Invitations retrieved successfully', data: formattedInvitations });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Error retrieving invitations:', error_2);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getInvitations = getInvitations;
// Controller method to accept an invitation
// Controller method to accept an invitation
var acceptInvitation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var invitationId, invitation_1, team, existingMemberIndex, update, _a, _b, _c, error_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                invitationId = req.params.invitationId;
                return [4 /*yield*/, contractor_team_invitation_model_1.default.findById(invitationId)];
            case 1:
                invitation_1 = _d.sent();
                if (!invitation_1) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Invitation not found' })];
                }
                if (invitation_1.status === contractor_team_invitation_model_1.TeamInvitationStatus.ACCEPTED) {
                    // Optionally return a message here if the invitation is already accepted
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitation is already accepted' })];
                }
                if (invitation_1.status === contractor_team_invitation_model_1.TeamInvitationStatus.REJECTED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitation is already rejected' })];
                }
                invitation_1.status = contractor_team_invitation_model_1.TeamInvitationStatus.ACCEPTED;
                return [4 /*yield*/, contractor_team_model_1.default.findById(invitation_1.team)];
            case 2:
                team = _d.sent();
                if (!team) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Team not found' })];
                }
                existingMemberIndex = team.members.findIndex(function (member) { return member.contractor.equals(invitation_1.contractor); });
                // If contractor doesn't exist in the array, add a new member; otherwise, update the existing member
                if (existingMemberIndex === -1) {
                    team.members.push({ contractor: invitation_1.contractor, role: invitation_1.role, status: contractor_team_model_1.TeamMemberStatus.ACTIVE, dateJoined: new Date() });
                }
                else {
                    update = {
                        contractor: invitation_1.contractor,
                        role: invitation_1.role,
                        status: contractor_team_model_1.TeamMemberStatus.ACTIVE,
                        dateJoined: new Date()
                    };
                    // Update the existing member in the array
                    team.members[existingMemberIndex] = __assign(__assign({}, team.members[existingMemberIndex]), update);
                }
                _b = (_a = Promise).all;
                _c = [team.save()];
                return [4 /*yield*/, invitation_1.deleteOne()];
            case 3: 
            // Save changes to the team and the invitation
            return [4 /*yield*/, _b.apply(_a, [_c.concat([_d.sent()])])];
            case 4:
                // Save changes to the team and the invitation
                _d.sent();
                res.json({ success: true, message: 'Invitation accepted successfully', data: invitation_1 });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _d.sent();
                console.error('Error accepting invitation:', error_3);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.acceptInvitation = acceptInvitation;
// Controller method to reject an invitation
var rejectInvitation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var invitationId, invitation, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                invitationId = req.params.invitationId;
                return [4 /*yield*/, contractor_team_invitation_model_1.default.findById(invitationId)];
            case 1:
                invitation = _a.sent();
                if (!invitation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Invitation not found' })];
                }
                if (invitation.status === contractor_team_invitation_model_1.TeamInvitationStatus.ACCEPTED) {
                    // Optionally return a message here if the invitation is already accepted
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitation is already accepted' })];
                }
                if (invitation.status === contractor_team_invitation_model_1.TeamInvitationStatus.REJECTED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitation is already rejected' })];
                }
                invitation.status = contractor_team_invitation_model_1.TeamInvitationStatus.REJECTED;
                invitation.deleteOne();
                res.json({ success: true, message: 'Invitation rejected successfully', data: invitation });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error rejecting invitation:', error_4);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.rejectInvitation = rejectInvitation;
exports.TeamInvitationController = {
    inviteToTeam: exports.inviteToTeam,
    getInvitations: exports.getInvitations,
    acceptInvitation: exports.acceptInvitation,
    rejectInvitation: exports.rejectInvitation,
};
