

import { Response } from 'express';
import { ContractorScheduleModel, IContractorSchedule } from '../../../database/contractor/models/contractor_schedule.model';
import { validationResult } from 'express-validator';
import { isValid, startOfMonth, endOfMonth, startOfYear, endOfYear, format, getDate, endOfDay } from 'date-fns';
import { ContractorProfileModel } from '../../../database/contractor/models/contractor_profile.model';
import { generateExpandedSchedule } from '../../../utils/schedule.util';
import { JOB_STATUS, JobModel } from '../../../database/common/job.model';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';


export const createSchedule = async (req: any, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    }

    // Extract data from the request
    const { dates, type, recurrence } = req.body;
    const contractorId = req.contractor.id;

    // Create an array to store the created schedules and conflicts
    const schedules: IContractorSchedule[] = [];

    // Iterate through the array of dates and create/update each schedule
    for (const date of dates) {


       // Get the end of the current day (11:59:59 PM)
        const dateParts = date.split('-').map((part: any) => part.padStart(2, '0'));
        const formattedDate = dateParts.join('-');

        let dateTimeString = `${new Date(formattedDate).toISOString().split('T')[0]}T${'23:59:59.000Z'}`; // Combine date and time
        let newDate = new Date(dateTimeString);

        console.log(newDate)


      // Find the existing schedule for the given date and type
      const existingSchedule = await ContractorScheduleModel.findOne({ contractor: contractorId, date });

      if (existingSchedule) {
        // Update the existing schedule if it exists
        existingSchedule.recurrence = recurrence;
        existingSchedule.type = type;
        existingSchedule.date = newDate;
        const updatedSchedule = await existingSchedule.save();
        schedules.push(updatedSchedule);
      } else {
        // Create a new schedule if it doesn't exist
        const newScheduleData: IContractorSchedule = {
          contractor: contractorId,
          date: newDate,
          type,
          recurrence,
        };

        const newSchedule = await ContractorScheduleModel.create(newScheduleData);


        schedules.push(newSchedule);
      }
    }  

    res.json({
      success: true,
      message: 'Schedules created successfully',
      data: schedules,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A schedule already exists for the given date' });
    }

    console.error('Error creating/updating schedules:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const setAvailability = async (req: any, res: Response) => {
  try {
    const { availability, isOffDuty } = req.body;
    const contractorId = req.contractor.id;

    const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })


    if (!contractorProfile) {
      return res.status(400).json({ success: false, message: 'Contractor not found' });
    }

    contractorProfile.availability = availability
    if (isOffDuty) {
      contractorProfile.isOffDuty = isOffDuty
    }
    await contractorProfile.save()


    res.json({ success: true, message: 'Schedules updated successfully' });

  } catch (error) {
    console.error('Error retrieving schedules:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const toggleOffDuty = async (req: any, res: Response) => {
  try {
    const contractorId = req.contractor.id;

    const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })

    if (!contractorProfile) {
      return res.status(400).json({ success: false, message: 'Contractor not found' });
    }

    contractorProfile.isOffDuty = !contractorProfile.isOffDuty;
    await contractorProfile.save()

    res.json({ success: true, message: 'Vacation mode updated successfully' });

  } catch (error) {
    console.error('Error retrieving schedules:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



export const getSchedulesByDate = async (req: any, res: Response) => {
  try {
    let { year, month } = req.query;
    const contractorId = req.contractor.id;

    const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })

    if (!contractorProfile) {
      return res.status(400).json({ success: false, message: 'Contractor not found' });
    }
    if (year && !isValid(new Date(`${year}-01-01`))) {
      return res.status(400).json({ success: false, message: 'Invalid year format' });
    }

    let startDate: number | Date, endDate: number | Date;

    if (!year) {
      year = new Date().getFullYear().toString();
    }

    if (month) {
      // If month is specified, retrieve schedules for that month
      if (!isValid(new Date(`${year}-${month}-01`))) {
        return res.status(400).json({ success: false, message: 'Invalid month format' });
      }

      startDate = startOfMonth(new Date(`${year}-${month}-01`));
      endDate = endOfMonth(new Date(`${year}-${month}-01`));
    } else {
      // If no month specified, retrieve schedules for the whole year
      startDate = startOfYear(new Date(`${year}-01-01`));
      endDate = endOfYear(new Date(`${year}-12-31`));
    }


    // Group schedules by year and month
    const expandedSchedules: any = generateExpandedSchedule(contractorProfile.availability, year).filter(schedule => {
      return schedule.date >= startDate && schedule.date <= endDate;
    });


    // const jobSchedules = await JobModel.find({
    //   contractor: contractorId,
    //   'schedule.startDate': { $gte: startDate, $lte: endDate },
    // }).then(jobs => jobs.map(job => ({ date: job.schedule.startDate, type: job.schedule.type, contractor: job.contractor, events: [{ job: job.id }] })));

    const jobs = await JobModel.find({
      contractor: contractorId,
      'schedule.startDate': { $gte: startDate, $lte: endDate },
    }).populate('contract')
    
    const jobSchedules = await Promise.all(jobs.map(async (job) => {
      const contractor = await ContractorModel.findById(job.contractor);
      return { date: job.schedule.startDate, type: job.schedule.type, contractor: contractor, events: [
        {
          //@ts-ignore
          totalAmount: job.contract.charges.totalAmount, 
         job: job.id, 
         skill: job?.category ,
         date: job?.schedule.startDate 
        }
    ]};
    }));
    
    

    const existingSchedules = await ContractorScheduleModel.find({contractor: contractorId})


    // Concatenate expandedSchedules and existingSchedules
    const mergedSchedules = [...expandedSchedules, ...jobSchedules, ...existingSchedules];


    let uniqueSchedules: any = [];
    mergedSchedules.forEach((schedule, index) => {
      const date = format(schedule.date, 'yyyy-M-d');
      const isFirstOccurrence = mergedSchedules.findIndex((s) => format(s.date, 'yyyy-M-d') === date) === index;

      if (isFirstOccurrence || schedule.type !== 'available') {
        // Check if the schedule is the first occurrence or its type is not 'available'
        const indexOfExistingSchedule = uniqueSchedules.findIndex((su: any) => format(su.date, 'yyyy-M-d') === date && su.type === 'available');

        if (indexOfExistingSchedule !== -1) {
          uniqueSchedules.splice(indexOfExistingSchedule, 1); // Remove existing 'available' schedule
        }

        uniqueSchedules.push(schedule);
      }
    });







    const groupedSchedules = await uniqueSchedules.reduce((acc: any, schedule: any) => {
      const key = format(new Date(schedule.date), 'yyyy-M');
      if (!acc[key]) {
        acc[key] = { schedules: [], summary: {}, events: [] };
      }
      schedule.contractor = contractorId
      schedule.date = format(new Date(schedule.date), "yyyy-MM-dd'T'HH:mm:ss"); //'yyyy-M-d HH:mm:ss'
      acc[key].schedules.push(schedule);

      // Use the event type as the key for the summary object
      if (!acc[key].summary[schedule.type]) {
        acc[key].summary[schedule.type] = [];
      }
      acc[key].summary[schedule.type].push(getDate(new Date(schedule.date)));

      // TODO: 
      // Include events summary if events are defined
      if (schedule.events) {
        // const eventsSummary = schedule.events.map((event: any) => ({
        //   title: event.title,
        //   booking: event.booking,
        //   date: event.date,
        //   startTime: event.startTime,
        //   endTime: event.endTime,
        // }));


        const eventsSummary = schedule.events.map((event: any) => ({
          ...event
        }));

        // const eventsSummary = await JobModel.find({ 'schedule.startDate': { $gte: startDate, $lte: endDate } })
        //   .select('_id contract customer contractor quotations category, schedule')
        //   .populate('contract');

        acc[key].events = acc[key].events.concat(eventsSummary);
      }

      return acc;
    }, {});



    res.json({ success: true, message: 'Schedules retrieved successfully', data: groupedSchedules });
  } catch (error) {
    console.error('Error retrieving schedules:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};





export const getEventsByMonth = async (req: any, res: Response) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;
    const contractorId = req.contractor.id;

    if (!year || !isValid(new Date(`${year}-01-01`))) {
      return res.status(400).json({ success: false, message: 'Invalid year format' });
    }

    let startDate, endDate;

    if (month) {
      // If month is specified, retrieve events for that month
      if (!isValid(new Date(`${year}-${month}-01`))) {
        return res.status(400).json({ success: false, message: 'Invalid month format' });
      }

      startDate = startOfMonth(new Date(`${year}-${month}-01`));
      endDate = endOfMonth(new Date(`${year}-${month}-01`));
    } else {
      // If no month specified, retrieve events for the whole year
      startDate = startOfYear(new Date(`${year}-01-01`));
      endDate = endOfYear(new Date(`${year}-12-31`));
    }

    // const jobs = await JobModel.find({ 'schedule.startDate': { $gte: startDate, $lte: endDate } }).select(['_id']).populate('contract')

    const jobs = await JobModel.find({ status: { $in: [JOB_STATUS.PENDING, JOB_STATUS.ONGOING, JOB_STATUS.BOOKED] }, contractor: contractorId, 'schedule.startDate': { $gte: startDate, $lte: endDate } })
      .select('_id contract customer contractor  category, schedule status')
      .populate('contract');


    res.json({ success: true, message: 'Events retrieved successfully', data: jobs });
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



export const isDateInExpandedSchedule = async (req: any, res: Response) => {
  try {
    const { startDate, availabilityDays } = req.body;
    const contractorId = req.contractor.id;

    const dateToCheck = new Date('2024-12-08T23:00:00.000Z')

    // Check if the date falls within the expanded schedule
    const expandedSchedule = generateExpandedSchedule(availabilityDays);
    const isDateInExpandedSchedule = expandedSchedule.some((schedule: any) => dateToCheck.toDateString() === schedule.date.toDateString());

    res.json({ success: true, message: 'Events retrieved successfully', data: isDateInExpandedSchedule });
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};





export const ScheduleController = {
  createSchedule,
  getSchedulesByDate,
  getEventsByMonth,
  isDateInExpandedSchedule,
  setAvailability,
  toggleOffDuty
}



