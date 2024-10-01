import { validationResult } from "express-validator";
import { Response } from "express";
import {  JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";



export const getStats = async (
    req: any,
    res: Response,
  ) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // Prepare the date filter
      let dateFilter: any = {};
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          dateFilter = { createdAt: { $gte: start, $lte: end } };
        } else {
          return res.status(400).json({ success: false, message: "Invalid date format" });
        }
      }
  
      // General stats
      const totalJob = await JobModel.countDocuments(dateFilter);
      const totalCustomers = await CustomerModel.countDocuments(dateFilter);
      const totalContractors = await ContractorModel.countDocuments(dateFilter);
      const totalRevenue = await TransactionModel.countDocuments({
        ...dateFilter,
        type: { $in: [TRANSACTION_TYPE.CHANGE_ORDER_PAYMENT, TRANSACTION_TYPE.JOB_DAY_PAYMENT, TRANSACTION_TYPE.SITE_VISIT_PAYMENT] },
      });
  
      // Job Status Counts
      const allJobs = await JobModel.countDocuments();
      const totalCanceled = await JobModel.countDocuments({ status: JOB_STATUS.CANCELED });
      const totalCompleted = await JobModel.countDocuments({ status: JOB_STATUS.COMPLETED });
      const totalPending = await JobModel.countDocuments({ status: JOB_STATUS.PENDING });
      const totalBooked = await JobModel.countDocuments({ status: JOB_STATUS.BOOKED });
      const totalDisputed = await JobModel.countDocuments({ status: { $in: [JOB_STATUS.DISPUTED, JOB_STATUS.NOT_STARTED] } });
      const totalOngoing = await JobModel.countDocuments({ status: JOB_STATUS.ONGOING });
      const totalExpired = await JobModel.countDocuments({ status: JOB_STATUS.EXPIRED });
  
      // Generate pie chart data
      const jobPieChartData = {
        labels: ["Canceled", "Completed", "Pending", "Disputed"],
        datasets: [
          {
            label: "Job Status Distribution",
            data: [totalCanceled, totalCompleted, totalPending, totalDisputed],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40"], // Colors for the chart segments
          },
        ],
      };
  
      // Calculate percentages
      const completedPercentage = ((totalCompleted / allJobs) * 100).toFixed(2);
      const pendingPercentage = ((totalPending / allJobs) * 100).toFixed(2);
      const disputedPercentage = ((totalDisputed / allJobs) * 100).toFixed(2);
      const ongoingPercentage = ((totalOngoing / allJobs) * 100).toFixed(2);
      const bookedPercentage = ((totalBooked / allJobs) * 100).toFixed(2);
      const expiredPercentage = ((totalExpired / allJobs) * 100).toFixed(2);
  
      // Initialize arrays for all 12 months with 0 values
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRevenuePlot = Array(12).fill(0).map((_, index) => ({
        month: months[index],
        revenue: 0,
      }));
      const monthlyJobPlot = Array(12).fill(0).map((_, index) => ({
        month: months[index],
        jobs: 0,
      }));
  
      // Monthly revenue plot
      const monthlyRevenue = await TransactionModel.aggregate([
        {
          $match: {
            ...dateFilter,
            type: { $in: [TRANSACTION_TYPE.CHANGE_ORDER_PAYMENT, TRANSACTION_TYPE.JOB_DAY_PAYMENT, TRANSACTION_TYPE.SITE_VISIT_PAYMENT] },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalRevenue: { $sum: "$amount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
  
      // Monthly job plot
      const monthlyJobs = await JobModel.aggregate([
        {
          $match: dateFilter,
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalJobs: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
  
      // Populate the initialized arrays with actual data
      monthlyRevenue.forEach((item: any) => {
        monthlyRevenuePlot[item._id - 1].revenue = item.totalRevenue;
      });
  
      monthlyJobs.forEach((item: any) => {
        monthlyJobPlot[item._id - 1].jobs = item.totalJobs;
      });
  
      return res.json({
        success: true,
        message: "Overview stats retrieved",
        data: {
          totalJob,
          totalCustomers,
          totalContractors,
          totalRevenue,
          allJobs,
          jobPieChartData,
          jobPercentages: [
            { completedPercentage, pendingPercentage, disputedPercentage, ongoingPercentage, bookedPercentage, expiredPercentage },
          ],
          monthlyRevenuePlot,
          monthlyJobPlot,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
  

export const AdminAnalyticsController = {
    getStats,
}



