"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamInvitationController = exports.rejectInvitation = exports.acceptInvitation = exports.getInvitations = exports.inviteToTeam = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractor_invitation_model_1 = __importStar(require("../../../database/contractor/models/contractor_invitation.model"));
var contractor_team_model_1 = __importDefault(require("../../../database/contractor/models/contractor_team.model"));
var team_invitation_email_template_1 = require("../../../templates/contractorEmail/team_invitation_email.template");
var services_1 = require("../../../services");
// Controller method to invite a user to join a team
var inviteToTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, contractorId, role, contractorCompany, company, contractor, existingInvitation, htmlContent, team, newInvitation, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                }
                _a = req.body, contractorId = _a.contractorId, role = _a.role;
                contractorCompany = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorCompany)];
            case 1:
                company = _b.sent();
                if (!company) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Company not found' })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 2:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                return [4 /*yield*/, contractor_invitation_model_1.default.findOne({
                        contractor: contractor.id,
                        company: company.id,
                        status: { $in: [contractor_invitation_model_1.TeamMemberStatus.PENDING, contractor_invitation_model_1.TeamMemberStatus.ACTIVE] }
                    })];
            case 3:
                existingInvitation = _b.sent();
                if (!existingInvitation) return [3 /*break*/, 6];
                if (!(existingInvitation.status == contractor_invitation_model_1.TeamMemberStatus.PENDING)) return [3 /*break*/, 5];
                htmlContent = (0, team_invitation_email_template_1.NewTeamInvitationEmail)(contractor.firstName, company.companyName);
                return [4 /*yield*/, services_1.EmailService.send(contractor.email, 'Team Invitation Reminder', htmlContent)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [2 /*return*/, res.status(400).json({ success: false, message: 'Invitee is already invited' })];
            case 6: return [4 /*yield*/, contractor_team_model_1.default.findOne({ contractor: company.id })];
            case 7:
                team = _b.sent();
                if (!!team) return [3 /*break*/, 9];
                return [4 /*yield*/, contractor_team_model_1.default.create({ name: 'Default Team', contractor: company.id, members: [] })];
            case 8:
                // Create a new team if it doesn't exist
                team = _b.sent();
                _b.label = 9;
            case 9: return [4 /*yield*/, contractor_invitation_model_1.default.create({
                    contractor: contractor.id,
                    company: company.id,
                    role: role,
                    status: contractor_invitation_model_1.TeamMemberStatus.PENDING,
                })];
            case 10:
                newInvitation = _b.sent();
                res.status(201).json({ success: true, message: 'Invitation sent successfully', data: newInvitation });
                return [3 /*break*/, 12];
            case 11:
                error_1 = _b.sent();
                console.error('Error inviting to team:', error_1);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.inviteToTeam = inviteToTeam;
// Controller method to get all invitations for a contractor
var getInvitations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractor, invitations, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                contractor = req.contractor.id;
                return [4 /*yield*/, contractor_invitation_model_1.default.find({ contractor: contractor }).populate('contractor').exec()];
            case 1:
                invitations = _a.sent();
                res.json({ success: true, message: 'Invitations retrieved successfully', data: invitations });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error retrieving invitations:', error_2);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getInvitations = getInvitations;
// Controller method to accept an invitation
var acceptInvitation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var invitationId, invitation, team, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                invitationId = req.params.invitationId;
                return [4 /*yield*/, contractor_invitation_model_1.default.findById(invitationId)];
            case 1:
                invitation = _a.sent();
                if (!invitation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Invitation not found' })];
                }
                // Update the invitation status to ACTIVE
                invitation.status = contractor_invitation_model_1.TeamMemberStatus.ACTIVE;
                // TODO: push to Team members array
                return [4 /*yield*/, invitation.save()];
            case 2:
                // TODO: push to Team members array
                _a.sent();
                return [4 /*yield*/, contractor_team_model_1.default.findOne({ contractor: invitation.company })];
            case 3:
                team = _a.sent();
                if (!team) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Team not found' })];
                }
                // Add contractor to team members
                team.members.push({ contractor: invitation.contractor, role: invitation.role, status: contractor_invitation_model_1.TeamMemberStatus.ACTIVE });
                return [4 /*yield*/, team.save()];
            case 4:
                _a.sent();
                res.json({ success: true, message: 'Invitation accepted successfully', data: invitation });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
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
    var invitationId, deletedInvitation, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                invitationId = req.params.invitationId;
                return [4 /*yield*/, contractor_invitation_model_1.default.findByIdAndDelete(invitationId)];
            case 1:
                deletedInvitation = _a.sent();
                if (!deletedInvitation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Invitation not found' })];
                }
                // TODO: remove to Team members array
                res.json({ success: true, message: 'Invitation rejected successfully', data: deletedInvitation });
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
