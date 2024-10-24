import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JobModel } from "../../../database/common/job.model";
import { InvoiceModel } from "../../../database/common/invoices.shema";
import { PROMOTION_STATUS, PromotionModel } from "../../../database/common/promotion.schema";
import { CouponModel } from "../../../database/common/coupon.schema";
import { generateCouponCode } from "../../../utils/couponCodeGenerator";
import { InternalServerError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";



//get single customer job detail /////////////
export const AdminGetSingleCustomerJobDetailController = async (
  req: any,
  res: Response,
) => {

  try {
    let {
      customerId
    } = req.params;

    let {
      page,
      limit
    } = req.query;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin = req.admin;
    const adminId = admin.id

    page = page || 1;
    limit = limit || 50;

    const customer = await CustomerModel.findOne({ _id: customerId })
      .select('-password')

    if (!customer) {
      return res
        .status(401)
        .json({ message: "invalid customer ID" });
    }

    const skip = (page - 1) * limit;

    const jobsDetails = await JobModel.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(['customer', 'contractor', 'quotation']);

    const totalJob = await JobModel.countDocuments({ customer: customerId })

    let jobs = []
    for (let i = 0; i < jobsDetails.length; i++) {
      const jobsDetail = jobsDetails[i];

      const invoice = await InvoiceModel.findOne({ jobId: jobsDetail._id })
      if (!invoice) continue

      const obj = {
        jobsDetail,
        invoice
      }

      jobs.push(obj)

    }

    res.json({
      currentPage: page,
      totalJob,
      totalPages: Math.ceil(totalJob / limit),
      jobs: jobsDetails
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}

//admin change customer account status  /////////////
export const AdminChangeCustomerAccountStatusController = async (
  req: any,
  res: Response,
) => {
  try {
    let {
      status,
      customerId,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const admin =  req.admin;
    const adminId = req.admin.id

    const admin = await AdminRegModel.findOne({ _id: adminId })

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Invalid admin ID" });
    }

    const customer = await CustomerModel.findOne({ _id: customerId })

    if (!customer) {
      return res
        .status(401)
        .json({ message: "Invalid customer ID" });
    }

    customer.status = status;
    await customer.save()

    res.json({
      message: `Customer account status successfully change to ${status}`
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}




export const issueCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { promotionId } = req.body; // Extract promotionId from the request body
    const { customerId } = req.params; // Extract userId from the request parameters

    // Find the promotion by ID
    const promotion = await PromotionModel.findById(promotionId);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    // Check if the promotion is active
    if (promotion.status !== PROMOTION_STATUS.ACTIVE) {
      return res.status(400).json({ success: false, message: 'Promotion is not active' });
    }

    // Create a new user coupon with promotion details
    const newUserCoupon = new CouponModel({
      promotion: promotion._id, // Attach promotion ID
      name: promotion.name,
      code: generateCouponCode(7), // generate coupon code here
      user: customerId,
      userType: 'customers',
      valueType: promotion.valueType,
      value: promotion.value,
      applicableAtCheckout: true,
      expiryDate: promotion.endDate,
      status: 'active'
    });

    // Save the new coupon
    await newUserCoupon.save();

    // Respond with success message
    return res.json({ success: true, message: 'Promotion attached to user as coupon', data: newUserCoupon });
  } catch (error: any) {
    // Handle any errors that occur
    return next(new InternalServerError(`Error attaching promotion to user coupon: ${error.message}`, error));
  }
};


export const getCustomers = async (
  req: any, res: Response
) => {
  try {

    const { data, filter } = await applyAPIFeature(CustomerModel.find(), req.query);

    // Get customers count with job bookings
    const customersWithBooking = (await JobModel.distinct('customer', { ...filter, customer: { $ne: null } })).length;

    return res.json({
      success: true,
      message: "Customer stats retrieved",
      data: {
        ...data,
        stats: {
          customersWithBooking
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}


export const getSingleCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const customer = await CustomerModel.findById(customerId);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "invalid customer ID" });
    }

    return res.json({
      success: true,
      message: "Customer retrieved",
      data: customer
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}


export const AdminCustomerController = {
  AdminGetSingleCustomerJobDetailController,
  AdminChangeCustomerAccountStatusController,
  issueCoupon,
  getCustomers,
  getSingleCustomer
}