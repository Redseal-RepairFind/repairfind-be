import { ObjectId } from "mongoose";
import { ReferralModel } from "../database/common/referral_code.schema";

export const generateCouponCode = (length: number) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = 'RCC'; // Prefix
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };


  export const generateReferralCode = async ({length, userId, userType}: {length: number, userId: ObjectId, userType: string }) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = 'RRC'; // Prefix
    let isUnique = false;
  
    // Keep regenerating until a unique code is found
    while (!isUnique) {
      result = 'RRC'; // Reset prefix
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
  
      const codeExists = await ReferralModel.exists({ code: result });
      if (!codeExists) {
        isUnique = true; // Exit the loop if no matching code is found
      }
    }
  
    // Create the referral document with the unique code
    await ReferralModel.create({ code: result, user: userId, userType });
    return result;
  };

  

export function generateOTP() {
    let otp = "";
    const allowedChars = "123456789";
    for (let i = 0; i < 4; i++) {
      otp += allowedChars.charAt(
        Math.floor(Math.random() * allowedChars.length)
      );
    }
    return otp;
  }
  
  export const OTP_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds


export const GeneratorUtil = {
    generateOTP,
    generateCouponCode,
    generateReferralCode
  }