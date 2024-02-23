"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProfileRequest = void 0;
var express_validator_1 = require("express-validator");
exports.CreateProfileRequest = [
    //  validate for all
    // body("profileType").notEmpty(),
    (0, express_validator_1.body)("location.address").notEmpty(),
    (0, express_validator_1.body)("location.latitude").notEmpty().isNumeric(),
    (0, express_validator_1.body)("location.longitude").notEmpty().isNumeric(),
    (0, express_validator_1.body)("profilePhoto.url").notEmpty().isURL(),
    (0, express_validator_1.body)('backgrounCheckConsent')
        .exists({ checkFalsy: true }).withMessage('Background consent is required')
        .custom(function (value) { return value === true; }).withMessage('You must consent to us running a background check'),
    //  only validate when  accountType  is  Company and Individual
    (0, express_validator_1.body)("name").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("skill").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstNumber").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstType").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("experienceYear").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isNumeric(),
    (0, express_validator_1.body)("about").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional(),
    (0, express_validator_1.body)("website").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isURL(),
    (0, express_validator_1.body)("email").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isEmail(),
    (0, express_validator_1.body)("phoneNumber").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty().isNumeric(),
    (0, express_validator_1.body)("emergencyJobs").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("availableDays").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty().isArray(),
    (0, express_validator_1.body)("previousJobPhotos").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
    (0, express_validator_1.body)("previousJobVideos").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
    //  validate only for 'Employee
    (0, express_validator_1.body)("firstName").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType === 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("lastName").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType === 'Employee';
    }).notEmpty(),
    // req.body.profileType
];
// Custom validation function for checking if an array of media objects contains 'url' property
var validateMediaArray = function (value) {
    return Array.isArray(value) && value.every(function (item) { return typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== ''; });
};
