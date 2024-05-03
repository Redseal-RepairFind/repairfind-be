import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AdminRegModel from "../../../database/admin/models/admin.model";

interface JwtPayload {
    email: string;
    _id: string;
}

interface CustomRequest extends Request {
    jwtPayload?: JwtPayload;
    admin: any;
}

export const checkAdminRole = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {

    let secret = process.env.JWT_ADMIN_SECRET_KEY;
  // Get JWT from Authorization header
  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    console.log('heafe', req.headers)
    console.log('token', token);
    console.log('secret', secret)
    // Verify JWT and extract payload
    const payload = jwt.verify(token, secret!) as unknown as JwtPayload;
   
    // Check if email and mobile are in the MongoDB and belong to an admin role
    const admin = await AdminRegModel.findOne({
      email: payload.email
    });

    if (!admin) {
      return res
        .status(403)
        .json({ message: "Access denied. admin role required." });
    }

    // Add the payload to the request object for later use
    req.admin = payload;
    
    // Call the next middleware function
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid authorization token" });
  }
}