"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContractorProfile = void 0;
var express_validator_1 = require("express-validator");
exports.createContractorProfile = [
    (0, express_validator_1.body)("name").notEmpty(),
    // body("gstNumber").notEmpty(),
    // body("gstType").notEmpty(),
    // location
    // body("address").notEmpty(),
    // body("latitude").notEmpty(),
    // body("longitude").notEmpty(),
    // body('backgrounCheckConsent')
    //     .exists({checkFalsy: true}).withMessage('Background consent is required')
    //     .custom((value, {req}) => value === true).withMessage("You must consent to us running a backgroun check"),
    // body("gstNumber").notEmpty(),
    // body("gstType").notEmpty(),
    // body("skill").notEmpty(),
    // body("experienceYear").optional(),
    // body("about").optional(),
    // body("website").optional(),
    // body("email").optional(),
    // body("emergencyJobs").notEmpty(),
    // body("availableDays").notEmpty(),
];
