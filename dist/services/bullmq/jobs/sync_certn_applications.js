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
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCertnApplications = void 0;
var __1 = require("../..");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var interface_dto_util_1 = require("../../../utils/interface_dto.util");
var logger_1 = require("../../logger");
var syncCertnApplications = function () { return __awaiter(void 0, void 0, void 0, function () {
    var contractors, _i, contractors_1, contractor, res, certnDetails, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4 /*yield*/, contractor_model_1.ContractorModel.find({
                        certnId: { $ne: null },
                        "certnDetails.report_status": { $ne: "COMPLETE" }
                    })];
            case 1:
                contractors = _a.sent();
                _i = 0, contractors_1 = contractors;
                _a.label = 2;
            case 2:
                if (!(_i < contractors_1.length)) return [3 /*break*/, 7];
                contractor = contractors_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, __1.CertnService.retrieveApplicant(contractor.certnId)];
            case 4:
                res = _a.sent();
                certnDetails = (0, interface_dto_util_1.castPayloadToDTO)(res, res);
                contractor.certnDetails = certnDetails;
                contractor.save();
                if (certnDetails.report_status == 'COMPLETE') {
                    __1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Background Check Complete',
                        type: 'BACKGROUND_CHECK', //
                        message: "Your background check with CERTN is now complete",
                        heading: { name: "Repairfind", image: 'https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png' },
                        payload: {}
                    }, { push: true, socket: true, database: true });
                }
                logger_1.Logger.info("Successfully synced certn profile for: ".concat(contractor.email));
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                logger_1.Logger.error("Error syncing  certn profile for: ".concat(contractor.email), error_1);
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                logger_1.Logger.error('Error occurred while syncing certn:', error_2);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.syncCertnApplications = syncCertnApplications;
