import { body, oneOf, validationResult } from "express-validator";

export const CreateProfileRequest  = [

    //  validate for all
    // body("profileType").notEmpty(),
    body("location.address").notEmpty(),
    body("location.latitude").notEmpty().isNumeric(),
    body("location.longitude").notEmpty().isNumeric(),
    body("profilePhoto.url").notEmpty().isURL(),
    body('backgrounCheckConsent')
        .exists({ checkFalsy: true }).withMessage('Background consent is required')
        .custom((value) => value === true).withMessage('You must consent to us running a background check'),


    //  only validate when  accountType  is  Company and Individual
    body("name").if((value: any, { req }: any) => req.contractor.accountType !== 'Employee').notEmpty(),
    body("skill").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').notEmpty(),
    body("gstNumber").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').notEmpty(),
    body("gstType").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').notEmpty(),
    body("experienceYear").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').optional().isNumeric(),
    body("about").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').optional(),
    body("website").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').optional().isURL(),
    body("email").if((value: any, { req }: any) => req.contractor.accountType !== 'Employee').optional().isEmail(),
    body("phoneNumber").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').notEmpty().isNumeric(),
    body("emergencyJobs").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').notEmpty(),
    body("availableDays").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').notEmpty().isArray(),
    body("previousJobPhotos").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),
    body("previousJobVideos").if((value: any, { req }: any) =>  req.contractor.accountType !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),

    //  validate only for 'Employee
    body("firstName").if((value: any, { req }: any) =>  req.contractor.accountType === 'Employee').notEmpty(),
    body("lastName").if((value: any, { req }: any) => req.contractor.accountType === 'Employee').notEmpty(),

    // req.body.profileType
];


// Custom validation function for checking if an array of media objects contains 'url' property
const validateMediaArray = (value: any): boolean => {
    return Array.isArray(value) && value.every((item) => typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== '');
};
