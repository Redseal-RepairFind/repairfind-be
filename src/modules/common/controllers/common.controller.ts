import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import SkillRegrModel from "../../../database/admin/models/skill.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { CountryModel } from "../../../database/common/country.schema";
import { BankModel } from "../../../database/common/bank.schema";
import { Logger } from "../../../services/logger";
import { PaymentUtil } from "../../../utils/payment.util";
import { APNNotification, sendAPN2Notification, sendAPNNotification, sendNotification, sendSilentNotification } from "../../../services/notifications/apn";
import { AppVersionModel } from "../../../database/common/app_versions.model";
import { GoogleServiceProvider } from "../../../services/google";
import { i18n } from "../../../i18n";


export const getBankList = async (
  req: Request,
  res: Response,
) => {

  try {
    const data = await BankModel.find()
    return res.json({ success: true, message: "Banks retrieved successful", data: data });
    
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }

}

export const getCountries = async (
  req: Request,
  res: Response,
) => {

  try {

    const countries = await CountryModel.find();
    return res.json({
      success: true,
      message: "Countries retrieved successful",
      data: countries
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}

export const getCurrencies = async (
  req: Request,
  res: Response,
) => {

  try {
    res.json({
      success: true,
      message: "Currencies retrieved successful",
      data: [
        
      ]

    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ success: false, message: err.message });
  }

}

export const getSkills = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  try {
    const skills   = await SkillRegrModel.find().sort('name').select('name -_id');
    res.json({ success: true, message: "Skills retrieved", data: skills});
  } catch (err: any) {
    return next(new InternalServerError('Error fetching skills', err))
  }

}


export const getOptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  try {
    const reasons   = [
      'Too expensive',
      'Got another estimate',
      'Not enough information',
    ]
    return res.json({ success: true, message: "Options retrieved", data: {quotationDeclineReasons: reasons}});
  } catch (err: any) {
    return next(new InternalServerError('Error fetching skills', err))
  }

}


export const getCurrentOrLatestAppVersions = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const app = req.query.app

      // Fetch current versions for both IOS and ANDROID
      let currentIosVersion = await AppVersionModel.findOne({ type: 'IOS', isCurrent: true, app }).exec();
      let currentAndroidVersion = await AppVersionModel.findOne({ type: 'ANDROID', isCurrent: true, app }).exec();
      
      // Fetch latest versions for both IOS and ANDROID if current versions are not found
      if (!currentIosVersion) {
          const latestIosVersion = await AppVersionModel.findOne({ type: 'IOS', app }).sort({ createdAt: -1 }).exec();
          currentIosVersion = latestIosVersion;
      }

      if (!currentAndroidVersion) {
          const latestAndroidVersion = await AppVersionModel.findOne({ type: 'ANDROID', app }).sort({ createdAt: -1 }).exec();
          currentAndroidVersion = latestAndroidVersion;
      }

      // Return the current or latest versions
      res.json({
          success: true,
          message: "App versions retrieved successfully",
          data: {
              IOS: currentIosVersion,
              ANDROID: currentAndroidVersion
          }
      });

  } catch (err: any) {
      return next(new InternalServerError("Error occurred while retrieving app versions", err));
  }
};


export const calculateCharges = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  try {
    const {amount = 0} = req.body

  
    const charges = await PaymentUtil.calculateCharges( {totalEstimateAmount: Number(amount)} )
    return res.json({ success: true, message: "Payment charges calculated", data: charges });

  } catch (err: any) {
    return next(new InternalServerError('Error calculating payment charges', err))
  }

}


export const sendTestNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  try {

    const {deviceToken} = req.body
    
    // sendFCMNotification('dEdej-ewShOgyAYGkT9TfY:APA91bEuSQEpsdhlIxPAVcH0xPIewHm5QofWhAPswQTF_PGSdhFSpvLxFNwzow2JCaCIIj9YX8cfbvD-wrL0NwkHzpU7rjwv06QcqFg_znvyoEAy1NCPRlS9wqhBGlSachsRTKVp-rF4')
    // sendFCMNotification('chsAINgk7k4mqtfzRUWFdd:APA91bF9G6U4R0zu7yMoDe3y4KIsf8Z_ECE3sTTuBNu21k86jrL4MUOc0RmPHphaNaIjxtLeAR6tXtq7-s_CHLXRoI4bG9tTfR4192gAqOX82P8Wr5FNWXXZj-spbyb5Bmj-qOVesmlw')
    
    // sendAPN2Notification('5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2')
    // sendSilentNotification(['5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2'])
    // sendAPNNotification('5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2')


    // APNNotification.sendAPN2Notification(deviceToken)

    

    // sam Prod iphone
    // 6aeb2d87992687389efde1c99c7a2a76e49b1b69e48dc78d81eb62a9b17486e0
    //5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2

    return res.json({ success: true, message: "Notification sent"});
  } catch (err: any) {
    return next(new InternalServerError('Error fetching skills', err))
  }

}


export const translateText = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  try {
    const {text, targetLang} = req.body

    const translatedText  = await i18n.getTranslation({phraseOrSlug:text, targetLang:targetLang, useGoogle: true, saveToFile: false})
    return res.json({ success: true, message: "Text translated", data: translatedText });
  } catch (err: any) {
    return next(new InternalServerError('Error translating text', err))
  }

}



export const CommonController = {
  getBankList,
  getSkills,
  getCountries,
  getOptions,
  sendTestNotification,
  calculateCharges,
  getCurrentOrLatestAppVersions,
  translateText
}

