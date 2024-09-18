import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomerREgModel from "../../../database/customer/models/customer.model";
import BlacklistedToken from "../../../database/common/blacklisted_tokens.schema";

interface JwtPayload {
    email: string;
    _id: string;
}

interface CustomRequest extends Request {
    jwtPayload?: JwtPayload;
    customer: any;
}

export const checkCustomerOrGuestRole = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {

    let secret = process.env.JWT_SECRET_KEY;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    
    if (!token) {
        return next();
    } else {
        try {

            const blacklistedToken = await BlacklistedToken.findOne({ token });
            if (blacklistedToken) {
                return res.status(401).json({ success: false, message: 'Invalid authorization token' });
            }

            const payload = jwt.verify(token, secret!) as unknown as JwtPayload;
            const customer = await CustomerREgModel.findOne({
                email: payload.email
            });

            if (!customer) {
                return res
                    .status(403)
                    .json({ success: false, message: "Access denied. customer role required." });
            }

            req.customer = payload;
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({ success: false, message: "Invalid authorization token" });
        }
    }


}