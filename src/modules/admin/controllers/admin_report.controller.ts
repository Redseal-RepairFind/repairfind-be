import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AbuseReportModel } from '../../../database/common/abuse_reports.model';
import { InternalServerError } from '../../../utils/custom.errors';

// Add a new report
export const addReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure report details from request body
        const { reporter, reporterType, reported, reportedType, type, comment, status, action, admin } = req.body;

        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
        }

        // Create a new report
        const newReport = new AbuseReportModel({
            reporter,
            reporterType,
            reported,
            reportedType,
            type,
            comment,
            status,
            action,
            admin
        });

        // Save the report to the database
        const savedReport = await newReport.save();
        return res.status(201).json({ success: true, message: 'Report successfully created', data: savedReport });
    } catch (err: any) {
        return next(new InternalServerError('Error occurred creating report', err));
    }
};

// Get all reports
export const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reports = await AbuseReportModel.find().populate('reporterDetails reportedDetails');
        return res.status(200).json({ success: true, message: 'Reports retrieved successfully', data: reports });
    } catch (err: any) {
        return next(new InternalServerError('Error occurred retrieving reports', err));
    }
};

// Get a single report by ID
export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const report = await AbuseReportModel.findById(id).populate('reporterDetails reportedDetails');
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        return res.status(200).json({ success: true, message: 'Report retrieved successfully', data: report });
    } catch (err: any) {
        return next(new InternalServerError('Error occurred retrieving report', err));
    }
};

// Update a report by ID
export const updateReport = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, action } = req.body;

        const admin = req.admin.id

        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
        }

        const updatedReport = await AbuseReportModel.findByIdAndUpdate(
            id,
            { status, action, admin },
            { new: true, runValidators: true }
        ).populate('reporterDetails reportedDetails');

        if (!updatedReport) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        return res.status(200).json({ success: true, message: 'Report successfully updated', data: updatedReport });
    } catch (err: any) {
        return next(new InternalServerError('Error occurred updating report', err));
    }
};

// Delete a report by ID
export const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedReport = await AbuseReportModel.findByIdAndDelete(id);

        if (!deletedReport) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        return res.status(200).json({ success: true, message: 'Report successfully deleted' });
    } catch (err: any) {
        return next(new InternalServerError('Error occurred deleting report', err));
    }
};

// Export controller methods
export const AdminReportController = {
    addReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
};
