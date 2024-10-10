import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomerModel from "../../../database/customer/models/customer.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { OtpEmailTemplate } from "../../../templates/common/OtpEmailTemplate";
import { GoogleServiceProvider } from "../../../services/google";
import { CustomerAuthProviders } from "../../../database/customer/interface/customer.interface";
import { FacebookServiceProvider } from "../../../services/facebook";
import { AppleIdServiceProvider, EmailService } from "../../../services";
import { config } from "../../../config";
import { CustomerWelcomeEmailTemplate } from "../../../templates/customer/welcome_email";
import { EmailVerificationTemplate } from "../../../templates/common/email_verification";
import { i18n } from "../../../i18n";
import { GeneratorUtil } from "../../../utils/generator.util";

export const signUp = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
      password,
      firstName,
      lastName,
      acceptTerms,
      phoneNumber,
      language
    } = req.body;


    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    // try find user with the same email
    const userEmailExists = await CustomerModel.findOne({ email });

    // check if user exists
    if (userEmailExists) {
      return res.status(401).json({ success: false, message: "Email exists already" });
    }

    const otp = generateOTP()
    const createdTime = new Date();

    const emailOtp = {
      otp,
      createdTime,
      verified: false
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = new CustomerModel({
      email,
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword,
      emailOtp,
      acceptTerms,
      language
    });

    const newReferralCode =  await GeneratorUtil.generateReferralCode({length: 6, userId: customer.id, userType: 'customers'});
    customer.referralCode = newReferralCode;
    let customerSaved = await customer.save();

    const welcomeHtml = CustomerWelcomeEmailTemplate(lastName)
    const translatedWelcomeHtml = await i18n.getTranslation({phraseOrSlug: welcomeHtml,targetLang: customer.language,saveToFile: false, useGoogle: true, contentType: 'html'}) || welcomeHtml;
    const translatedWelcomeSubject = await i18n.getTranslation({phraseOrSlug: "Welcome to Repairfind",targetLang: customer.language}) || 'Welcome to Repairfind';
    EmailService.send(email, translatedWelcomeSubject, translatedWelcomeHtml,)



    const emailVerificationHtml = OtpEmailTemplate(otp, firstName, 'We have received a request to verify your email');
    const translatedVerificationHtml = await i18n.getTranslation({phraseOrSlug: emailVerificationHtml,targetLang: customer.language,saveToFile: false, useGoogle: true, contentType: 'html'}) || emailVerificationHtml;
    const translatedVerificationSubject = await i18n.getTranslation({phraseOrSlug: "'Email Verification",targetLang: customer.language}) || 'Welcome to Repairfind';
    EmailService.send(email, translatedVerificationSubject, translatedVerificationHtml, )

    res.json({
      success: true,
      message: "Signup successful",
      data: {
        id: customerSaved._id,
        firstName: customerSaved.firstName,
        lastName: customerSaved.lastName,
        phoneNumber: customerSaved.phoneNumber,
        email: customerSaved.email,
      },

    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}


//customer verified email /////////////
export const verifyEmail = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
      otp,
      currentTimezone
    } = req.body;
    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    // try find customer with the same email
    const customer = await CustomerModel.findOne({ email });

    // check if contractor exists
    if (!customer) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    if (customer.emailOtp.otp != otp) {
      return res.status(401).json({ success: false, message: "Invalid otp" });
    }

    if (customer.emailOtp.verified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    const timeDiff = new Date().getTime() - customer.emailOtp.createdTime.getTime();
    if (timeDiff > OTP_EXPIRY_TIME) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    customer.emailOtp.verified = true;
    customer.currentTimezone = currentTimezone
    await customer.save();

    // generate access token
    const accessToken = jwt.sign(
      {
        id: customer?._id,
        email: customer.email,
        userType: 'customers',
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: config.jwt.tokenLifetime }
    );

    return res.json({
      success: true,
      message: "Email verified successfully",
      accessToken,
      expiresIn: config.jwt.tokenLifetime,
      data: customer
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}


export const signIn = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
      password,
      currentTimezone
    } = req.body;
    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    // try find user with the same email
    const customer = await CustomerModel.findOne({ email });

    // check if user exists
    if (!customer) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credential" });
    }

    if (!customer.password && customer.provider !== CustomerAuthProviders.PASSWORD) {
      return res.status(401).json({ success: false, message: "The email is associated with a social signon" });
    }


    // compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, customer.password);

    if (!customer.password && customer.provider) {
      return res.status(401).json({ success: false, message: `Account is associated with ${customer.provider} account` });
    }

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect credential." });
    }

    if (!customer.emailOtp.verified) {
      return res.status(401).json({ success: false, message: "The email is not verified" });
    }

    const profile = await CustomerModel.findOne({ email }).select('-password');

    // generate access token
    const accessToken = jwt.sign(
      {
        id: customer?._id,
        email: customer.email,
        userType: 'customers',
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: config.jwt.tokenLifetime }
    );

    if(!customer.referralCode){
      const newReferralCode = await GeneratorUtil.generateReferralCode({length: 6, userId: customer.id, userType: 'customers'});
      customer.referralCode = newReferralCode;
    }
    customer.currentTimezone = currentTimezone
    await customer.save()

    // return access token
    res.json({
      success: true,
      message: "Signin successful",
      accessToken,
      expiresIn: config.jwt.tokenLifetime,
      data: profile
    });


  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}

export const signInWithPhone = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      number,
      code,
      password,
      currentTimezone
    } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    // try find user with the same email
    const customer = await CustomerModel.findOne({ 'phoneNumber.number': number, 'phoneNumber.code': code });

    // check if user exists
    if (!customer) {
      return res
        .status(401)
        .json({ success: false, message: "The phone or password you entered is incorrect" });
    }

    if (!customer.password && customer.provider !== CustomerAuthProviders.PASSWORD) {
      return res
        .status(401)
        .json({ success: false, message: "These account is associated with a social signon" });
    }


    // compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, customer.password);


    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect credential." });
    }

    if (!customer.phoneNumber.verifiedAt) {
      return res.status(401).json({ success: false, message: "Phone number is not verified." });
    }

    const profile = await CustomerModel.findById(customer.id).select('-password');

    // generate access token
    const accessToken = jwt.sign(
      {
        id: customer?._id,
        email: customer.email,
        userType: 'customers',
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: config.jwt.tokenLifetime }
    );

    if(!customer.referralCode){
      const newReferralCode = await GeneratorUtil.generateReferralCode({length: 6, userId: customer.id, userType: 'customers'});
      customer.referralCode = newReferralCode;
    }
    customer.currentTimezone = currentTimezone
    await customer.save()

    // return access token
    res.json({
      success: true,
      message: "Signin successful",
      accessToken,
      expiresIn: config.jwt.tokenLifetime,
      data: profile
    });


  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}


//customer resend for verification email /////////////
export const resendEmail = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
    }

    const customer = await CustomerModel.findOne({ email });

    if (!customer) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    if (customer.emailOtp.verified) {
      // return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const otp = generateOTP()

    const createdTime = new Date();

    customer!.emailOtp = {
      otp,
      createdTime,
      verified: false
    }

    await customer?.save();

    const html = OtpEmailTemplate(otp, customer.firstName, "We have received a request to verify your email");
    const translatedHtml = await i18n.getTranslation({phraseOrSlug: html,targetLang: customer.language,saveToFile: false, useGoogle: true, contentType: 'html'}) || html;
    const translatedSubject = await i18n.getTranslation({phraseOrSlug: "Email Verification",targetLang: customer.language}) || 'Email Verification';

    EmailService.send(email, translatedSubject, translatedHtml)
    return res.status(200).json({ success: true, message: "OTP sent successfully to your email." });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



export const forgotPassword = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
    } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
    }

    // try find user with the same email
    const customer = await CustomerModel.findOne({ email });
    if (!customer) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email" });
    }

    const otp = generateOTP()

    const createdTime = new Date();

    customer!.passwordOtp = {
      otp,
      createdTime,
      verified: true
    }

    await customer?.save();

    const html = OtpEmailTemplate(otp, customer.firstName, "We have received a request to change your password");

    const translatedHtml = await i18n.getTranslation({ phraseOrSlug: html, targetLang: customer.language, saveToFile: false, useGoogle: true, contentType: 'html'}) || html;
    const translatedSubject = await i18n.getTranslation({ phraseOrSlug: "Password Change", targetLang: customer.language }) || 'Password Change';
    EmailService.send(email, translatedSubject, translatedHtml)

    return res.status(200).json({ success: true, message: "OTP sent successfully to your email." });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}

export const resetPassword = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
      otp,
      password
    } = req.body;
    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    const customer = await CustomerModel.findOne({ email });

    // check if contractor exists
    if (!customer) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    const { createdTime, verified } = customer.passwordOtp

    const timeDiff = new Date().getTime() - createdTime.getTime();

    if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== customer.passwordOtp.otp) {
      return res.status(401).json({ success: false, message: "Unable to reset password" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    customer.password = hashedPassword;
    customer.passwordOtp.verified = false;

    await customer.save();

    return res.status(200).json({ success: true, message: "password successfully change" });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}


export const verifyResetPasswordOtp = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, otp } = req.body;

    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    // Try to find customer with the given email
    const customer = await CustomerModel.findOne({ email });

    // Check if customer exists
    if (!customer) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    const { createdTime, verified } = customer.passwordOtp;

    const timeDiff = new Date().getTime() - createdTime.getTime();

    if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== customer.passwordOtp.otp) {
      return res.status(401).json({ success: false, message: "Unable to verify OTP" });
    }

    // Mark the OTP as verified
    customer.passwordOtp.verified = true;

    await customer.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//customer signup /////////////
export const googleSignon = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      accessToken,
    } = req.body;
    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    // call google service here
    const providerUser = await GoogleServiceProvider.getUserInfo(accessToken)

    const { email, name, picture, sub } = providerUser;

    const firstName = name.split(' ')[0]
    const lastName = name.split(' ')[1]

    const createdTime = new Date();
    const emailOtp = {
      otp: sub,
      createdTime,
      verified: true
    }

    const user = await CustomerModel.findOneAndUpdate(
      { email },
      {
        $setOnInsert: { // Set fields only during insert (when the user doesn't exist)
          email,
          firstName,
          lastName,
          provider: CustomerAuthProviders.GOOGLE,
          profilePhoto: { url: picture },
          emailOtp: {
            otp: sub,
            createdTime: new Date(),
            verified: true,
          },
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if it doesn't exist
        setDefaultsOnInsert: true, // Set default values for fields during insert
      }
    );


    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        userType: 'customers',
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '24h' }
    );


    res.json({
      status: true,
      message: 'Signon successful',
      accessToken: token,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });


  } catch (err: any) {
    // signup error
    res.status(500).json({ success: false, message: err.message });
  }

}



export const facebookSignon = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
    }

    // call Facebook service here
    const providerUser = await FacebookServiceProvider.getFacebookUserInfo(accessToken);

    const { id, name, email, picture } = providerUser;

    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];

    const createdTime = new Date();
    const emailOtp = {
      otp: id,
      createdTime,
      verified: true,
    };

    const user = await CustomerModel.findOneAndUpdate(
      { email },
      {
        $setOnInsert: { // Set fields only during insert (when the user doesn't exist)
          email,
          firstName,
          lastName,
          provider: CustomerAuthProviders.FACEBOOK,
          profileImg: picture?.data?.url,
          emailOtp: {
            otp: id,
            createdTime: new Date(),
            verified: true,
          },
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if it doesn't exist
        setDefaultsOnInsert: true, // Set default values for fields during insert
      }
    );

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        userType: 'customers',
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '24h' }
    );

    res.json({
      status: true,
      message: 'Signon successful',
      accessToken: token,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err: any) {
    // signup error
    res.status(500).json({ success: false, message: err.message });
  }
};



// TODO: BUG: 
export const appleSignon = async (req: Request, res: Response) => {
  try {

    
    const { accessToken, email, firstName, lastName } = req.body;

    // Check for Validation error occurred
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
    }

    // You need to verify the Apple ID token. You can use a library like `apple-authentication-jwt` for this.
    // Install it using: npm install apple-authentication-jwt

    const decodedToken = {
      sub: 'customerrepairfind.com',
      email: 'customer@repairfind.com'
    }

    // const decodedTokend = await AppleIdServiceProvider.getUserInfo(accessToken); // accessToken = idToken
    const decodedIdToken = await AppleIdServiceProvider.verifyIdToken(accessToken); // accessToken = idToken

    const decodedAccessToken = await AppleIdServiceProvider.decodeAccessToken(accessToken); // accessToken = idToken


    // Extract necessary information from the decoded token
    const appleUserId = decodedToken.sub;
    const appleEmail = decodedToken.email;


    const createdTime = new Date();
    const emailOtp = {
      otp: appleUserId,
      createdTime,
      verified: true,
    };

    const user = await CustomerModel.findOneAndUpdate(
      { email: email },
      {
        $setOnInsert: { // Set fields only during insert (when the user doesn't exist)
          email: email,
          firstName,
          lastName,
          provider: CustomerAuthProviders.APPLE,
          emailOtp,
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if it doesn't exist
        setDefaultsOnInsert: true, // Set default values for fields during insert
      }
    );

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        userType: 'customers',
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '24h' }
    );

    res.json({
      status: true,
      message: 'Signon successful',
      accessToken: token,
      data: user,
    });
  } catch (err: any) {
    // Handle errors appropriately
    res.status(400).json({ success: false, message: err.message });
  }
};




export const CustomerAuthController = {
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  signIn,
  resendEmail,
  verifyResetPasswordOtp,
  googleSignon,
  facebookSignon,
  appleSignon,
  signInWithPhone
}
