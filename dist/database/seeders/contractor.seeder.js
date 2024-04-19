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
exports.ContractorSeeder = void 0;
var contractor_interface_1 = require("../contractor/interface/contractor.interface");
var contractor_model_1 = require("../contractor/models/contractor.model");
var contractor_profile_model_1 = require("../contractor/models/contractor_profile.model");
var contractors = [
    {
        email: "employee@repairfind.com",
        firstName: "Employee",
        lastName: "Contractor",
        dateOfBirth: "23/12/2024",
        password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
        phoneNumber: {
            code: "+367",
            number: "2344252"
        },
        profilePhoto: {
            url: "https://dsfds"
        },
        acceptTerms: true,
        accountType: contractor_interface_1.CONTRACTOR_ACCOUNT_TYPE.Employee,
        passwordOtp: {
            verified: true,
        },
        emailOtp: {
            verified: true,
        },
        profileData: {
            location: {
                address: "Logics Senct",
                latitude: "12323123123",
                longitude: "2123213213213",
            },
            name: "Behd Guyt",
            profileType: "Employee",
        }
    },
    {
        email: "employee_upgraded@repairfind.com",
        firstName: "Upgraded",
        lastName: "Employee",
        dateOfBirth: "23/12/2024",
        password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
        phoneNumber: {
            code: "+367",
            number: "2344252"
        },
        profilePhoto: {
            url: "https://dsfds"
        },
        acceptTerms: true,
        accountType: contractor_interface_1.CONTRACTOR_ACCOUNT_TYPE.Employee,
        passwordOtp: {
            verified: true,
        },
        emailOtp: {
            verified: true,
        },
        profileData: {
            about: "About us here",
            availableDays: [
                "Monday",
                "Tuesday"
            ],
            backgrounCheckConsent: true,
            emergencyJobs: true,
            experienceYear: 5,
            gstNumber: "4442223",
            gstType: "Type",
            location: {
                address: "Logics Senct",
                latitude: "12323123123",
                longitude: "2123213213213",
            },
            name: "Behd",
            phoneNumber: "3234234",
            previousJobPhotos: [
                {
                    url: "string",
                }
            ],
            previousJobVideos: [
                {
                    url: "string",
                }
            ],
            profileType: "Company",
            skill: "Plumber",
            website: "https://skdjfjkfdsjk.com",
            certnId: "5d1aabc8-e9c9-4e99-8b2f-14ac6995f13f"
        }
    },
    {
        email: "individual@repairfind.com",
        firstName: "Individual",
        lastName: "Contractor",
        dateOfBirth: "23/12/2024",
        password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
        phoneNumber: {
            code: "+367",
            number: "2344252"
        },
        profilePhoto: {
            url: "https://dsfds"
        },
        acceptTerms: true,
        accountType: contractor_interface_1.CONTRACTOR_ACCOUNT_TYPE.Individual,
        passwordOtp: {
            verified: true,
        },
        emailOtp: {
            verified: true,
        },
        profileData: {
            about: "About us here",
            availableDays: [
                "Monday",
                "Tuesday"
            ],
            backgrounCheckConsent: true,
            emergencyJobs: true,
            experienceYear: 5,
            gstNumber: "4442223",
            gstType: "Type",
            location: {
                address: "Logics Senct",
                latitude: "12323123123",
                longitude: "2123213213213",
            },
            name: "Behd",
            phoneNumber: "3234234",
            previousJobPhotos: [
                {
                    url: "string",
                }
            ],
            previousJobVideos: [
                {
                    url: "string",
                }
            ],
            profileType: "Individual",
            skill: "Plumber",
            website: "https://skdjfjkfdsjk.com",
            certnId: "5d1aabc8-e9c9-4e99-8b2f-14ac6995f13f"
        }
    },
    {
        email: "company@repairfind.com",
        companyName: "Company",
        dateOfBirth: "23/12/2024",
        password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
        phoneNumber: {
            code: "+367",
            number: "2344252"
        },
        profilePhoto: {
            url: "https://dsfds"
        },
        acceptTerms: true,
        accountType: contractor_interface_1.CONTRACTOR_ACCOUNT_TYPE.Company,
        passwordOtp: {
            verified: true,
        },
        emailOtp: {
            verified: true,
        },
        profileData: {
            about: "About us here",
            availableDays: [
                "Monday",
                "Tuesday"
            ],
            backgrounCheckConsent: true,
            emergencyJobs: true,
            experienceYear: 5,
            gstNumber: "4442223",
            gstType: "Type",
            location: {
                address: "Logics Senct",
                latitude: "12323123123",
                longitude: "2123213213213",
            },
            name: "Behd",
            phoneNumber: "3234234",
            previousJobPhotos: [
                {
                    url: "string",
                }
            ],
            previousJobVideos: [
                {
                    url: "string",
                }
            ],
            profileType: "Company",
            skill: "Plumber",
            website: "https://skdjfjkfdsjk.com",
            certnId: "5d1aabc8-e9c9-4e99-8b2f-14ac6995f13f"
        }
    }
];
var ContractorSeeder = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            contractors.forEach(function (contractor) { return __awaiter(void 0, void 0, void 0, function () {
                var newContractor, newProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contractor_model_1.ContractorModel.findOneAndUpdate({ email: contractor.email }, contractor, { upsert: true, new: true, setDefaultsOnInsert: true })];
                        case 1:
                            newContractor = _a.sent();
                            if (!newContractor) return [3 /*break*/, 4];
                            return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOneAndUpdate({ contractor: newContractor.id }, __assign({ contractor: newContractor.id }, contractor.profileData), { upsert: true, new: true, setDefaultsOnInsert: true })];
                        case 2:
                            newProfile = _a.sent();
                            newContractor.profile = newProfile === null || newProfile === void 0 ? void 0 : newProfile.id;
                            return [4 /*yield*/, newContractor.save()];
                        case 3:
                            _a.sent(); // Make sure to use await here
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        }
        catch (error) {
            console.log("Error seeding challenge tags", error);
            return [2 /*return*/];
        }
        return [2 /*return*/];
    });
}); };
exports.ContractorSeeder = ContractorSeeder;
