import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import BlacklistedToken from "../../../database/common/blacklisted_tokens.schema";

interface JwtPayload {
  email: string;
  _id: string;
}

interface CustomRequest extends Request {
  jwtPayload?: JwtPayload;
  contractor: any;
}

export const checkContractorRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {

  let secret = process.env.JWT_CONTRACTOR_SECRET_KEY;
  // Get JWT from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }


  try {

    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token' });
    }

    const payload = jwt.verify(token, secret!) as unknown as JwtPayload;
    const contractor = await ContractorModel.findOne({
      email: payload.email
    });

    if (!contractor) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. contractor role required." });
    }
    req.contractor = contractor;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Invalid authorization token" });
  }
}