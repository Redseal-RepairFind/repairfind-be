import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import SkillRegrModel from "../../../database/admin/models/skill.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { CountryModel } from "../../../database/common/country.schema";
import { BankModel } from "../../../database/common/bank.schema";


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



export const CommonController = {
  getBankList,
  getSkills,
  getCountries,
  getOptions
}

