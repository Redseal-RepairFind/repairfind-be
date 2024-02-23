import { body } from 'express-validator';

export const CreateContractorRequest = [
    body('email').isEmail(),
    body('password').notEmpty(),
    body('passwordConfirmation')
        .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
        .custom((value, { req }) => value === req.body.password).withMessage('The passwords do not match'),
    body('phoneNumber').notEmpty(),
    body('accountType')
        .notEmpty()
        .isIn(['Individual', 'Company', 'JourneyMan']).withMessage('Account type must be one of: Individual, Company or JourneyMan'),
    body('acceptTerms')
        .notEmpty()
        .custom((value, { req }) => value === true).withMessage('You must accept our terms and conditions'),
    body('accountType').notEmpty(),
    // Conditional validations based on accountType
    
    body('firstName')
        .if((value: any, { req }: any) => ['Employee', 'Individual'].includes(req.body.accountType))
        .notEmpty().withMessage('First name is required for Employee or Individual accounts'),
    body('lastName')
        .if((value: any, { req }: any) => ['Employee', 'Individual'].includes(req.body.accountType))
        .notEmpty().withMessage('Last name is required for Employee or Individual accounts'),
    body('dateOfBirth')
        .if((value: any, { req }: any) => ['Employee', 'Individual'].includes(req.body.accountType))
        .notEmpty().withMessage('Date of birth is required for Employee or Individual accounts'),
    body('companyName')
        .if((value: any, { req }: any) => req.body.accountType === 'Company')
        .notEmpty().withMessage('Company name is required for Company accounts'),
];
