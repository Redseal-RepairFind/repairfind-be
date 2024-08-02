
import { body, query } from "express-validator";


export const clearSessionParams = [
  body("accessToken").notEmpty(),
  body("userId").notEmpty(),
  body("userType").notEmpty(),
  body("deviceToken").notEmpty(),
];

export const CommonHttpRequest = {
  clearSessionParams,
}