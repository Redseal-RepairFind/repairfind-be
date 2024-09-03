import { NextFunction, Request, Response } from "express";
import SkillRegrModel from "../../../database/admin/models/skill.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { CountryModel } from "../../../database/common/country.schema";
import { BankModel } from "../../../database/common/bank.schema";
import { Logger } from "../../../services/logger";
import { PaymentUtil } from "../../../utils/payment.util";
import { APNNotification, sendAPN2Notification, sendAPNNotification, sendNotification, sendSilentNotification } from "../../../services/notifications/apn";


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




export const CommonController = {
  getBankList,
}

