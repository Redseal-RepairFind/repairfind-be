

import { Request, Response } from 'express';
import { ContractorScheduleModel, IContractorSchedule, IEvent } from '../../../database/contractor/models/contractor_schedule.model';
import { validationResult } from 'express-validator';
import { isValid, startOfMonth, endOfMonth, startOfYear, endOfYear, format, getDate } from 'date-fns';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';
import { ContractorProfileModel } from '../../../database/contractor/models/contractor_profile.model';


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
      // Find the existing schedule for the given date and type
      const existingSchedule = await ContractorScheduleModel.findOne({ contractor: contractorId, date });

      if (existingSchedule) {
        // Update the existing schedule if it exists
        existingSchedule.recurrence = recurrence;
        existingSchedule.type = type;
        const updatedSchedule = await existingSchedule.save();
        schedules.push(updatedSchedule);
      } else {
        // Create a new schedule if it doesn't exist
        const newScheduleData: IContractorSchedule = {
          contractor: contractorId,
          date,
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





export const getSchedules = async (req: any, res: Response) => {
  try {
    const { year, month } = req.query;
    const contractorId = req.contractor.id;

    if (!year || !isValid(new Date(`${year}-01-01`))) {
      return res.status(400).json({ success: false, message: 'Invalid year format' });
    }


    let startDate, endDate;

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

    const schedules = await ContractorScheduleModel.find({
      contractor: contractorId,
      date: { $gte: startDate, $lte: endDate },
    });

    res.json({ success: true, message: 'Schedules retrieved successfully', data: schedules });
  } catch (error) {
    console.error('Error retrieving schedules:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const getSchedulesByDate = async (req: any, res: Response) => {
  try {
    const { year, month } = req.query;
    const contractorId = req.contractor.id;

    if (!year || !isValid(new Date(`${year}-01-01`))) {
      return res.status(400).json({ success: false, message: 'Invalid year format' });
    }

    let startDate, endDate;

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

    const schedules = await ContractorScheduleModel.find({
      contractor: contractorId,
      date: { $gte: startDate, $lte: endDate },
    });



    // Group schedules by year and month
    const groupedSchedules = schedules.reduce((acc: any, schedule) => {
      const key = format(new Date(schedule.date), 'yyyy-M');
      if (!acc[key]) {
        acc[key] = { schedules: [], summary: {}, events: []  };
      }
      acc[key].schedules.push(schedule);

      // Use the event type as the key for the summary object
      if (!acc[key].summary[schedule.type]) {
        acc[key].summary[schedule.type] = [];
      }
      acc[key].summary[schedule.type].push(getDate(new Date(schedule.date)));

      // Include events summary if events are defined
      if (schedule.events) {
        const eventsSummary = schedule.events.map((event: any) => ({
          title: event.title,
          booking: event.booking,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
        }));

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



export const addOrUpdateSchedule = async (req: any, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    }

    // Extract data from the request
    const { date, note, startTime, endTime, booking, title, type} = req.body;
    const contractorId = req.contractor.id;

    // Check if a schedule already exists for the given date
    const existingSchedule = await ContractorScheduleModel.findOne({ contractor: contractorId, date });

    if (existingSchedule) {
      
      
      // Update the existing schedule with the new event
      let events  =  existingSchedule.events || []

      let isOverlapping = events.some((event: any) => {
        const eventStartTime = new Date(event.startTime).getTime();
        const eventEndTime = new Date(event.endTime).getTime();
        const newEventStartTime = new Date(startTime).getTime();
        const newEventEndTime = new Date(endTime).getTime();
        return (
          (newEventStartTime >= eventStartTime && newEventStartTime < eventEndTime) ||
          (newEventEndTime > eventStartTime && newEventEndTime <= eventEndTime) ||
          (newEventStartTime <= eventStartTime && newEventEndTime >= eventEndTime)
        );
      });
      
      if (isOverlapping) {
        // Update the existing event with the new event
        const index = events.findIndex((event: any) => {
          const eventStartTime = new Date(event.startTime).getTime();
          const eventEndTime = new Date(event.endTime).getTime();
          const newEventStartTime = new Date(startTime).getTime();
          const newEventEndTime = new Date(endTime).getTime();
          return (
            (newEventStartTime >= eventStartTime && newEventStartTime < eventEndTime) ||
            (newEventEndTime > eventStartTime && newEventEndTime <= eventEndTime) ||
            (newEventStartTime <= eventStartTime && newEventEndTime >= eventEndTime)
          );
        });
      
        if (index !== -1) {
          events[index] = {
            ...events[index],
            startTime,
            endTime,
            booking,
            type,
            note,
            title,
          };
        }
      } else {
        // Add the new event to the events array
        events.push({
          startTime,
          endTime,
          booking,
          note,
          type,
          title,
        });
      }


      existingSchedule.events = events;
      const updatedSchedule = await existingSchedule.save();

      res.json({ success: true, message: 'Event added to the schedule successfully', data: updatedSchedule });
    } else {
      // Create a new schedule document
      const newScheduleData: IContractorSchedule = {
        contractor: contractorId,
        date,
        type: 'default', // Set a default type if needed
        recurrence: { frequency: 'Once' }, // Set default recurrence if needed
        events: [{
          date,
          startTime,
          endTime,
          booking,
          note,
          title
        }],
      };

      const newSchedule = await ContractorScheduleModel.create(newScheduleData);

      res.json({ success: true, message: 'Schedule created with the event successfully', data: newSchedule });
    }
  } catch (error) {
    console.error('Error adding or updating schedule:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const addOrUpdateAvailability = async (req: any, res: Response) => {
  try {

    const { days } = req.body;
    const contractorId = req.contractor.id;

    let contractorProfile = await ContractorProfileModel.findById({contractor: contractorId})
    
    if(!contractorProfile){
      return res.status(400).json({ success: false, message: 'Contractor profile not found' });
    }

    contractorProfile.availableDays = days;
    contractorProfile.save()
    
    res.json({ success: true, message: 'Availability Schedule updated  successfully', data: contractorProfile });

  } catch (error) {
    console.error('Error adding or updating schedule:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

};


export const getEventsByMonth = async (req: any, res: Response) => {
  try {
    const { year, month } = req.query;
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

    const schedules = await ContractorScheduleModel.find({
      contractor: contractorId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Group schedules by month
    const groupedEvents = schedules.reduce((acc: any, schedule) => {
      const key = format(new Date(schedule.date), 'yyyy-M');
      if (!acc[key]) {
        acc[key] = [];
      }

      // Include only the necessary fields in the response
      const formattedEvents = schedule.events?.map((event: any) => ({
        _id: event._id,
        date: event.date,
        type: event.type,
        booking: event.booking || {},
        title: event.title || '',
        note: event.note || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
      }));

      if (formattedEvents) {
        acc[key] = acc[key].concat(formattedEvents);
      }

      return acc;
    }, {});

    res.json({ success: true, message: 'Events retrieved successfully', data: groupedEvents });
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const expandWeeklyAvailability = async (req: any, res: Response) => {
  try {
    const { startDate, availabilityDays } = req.body;
    const contractorId = req.contractor.id;

    const expandedSchedule = generateExpandedSchedule(startDate, ["Monday", "Tuesday"]);

     // Fetch existing schedules within the specified timeframe
    const existingSchedules = await ContractorScheduleModel.find({
      contractor: contractorId,
      date: { $gte: startDate },
      recurrence: { frequency: 'Weekly' }, // Assuming only weekly schedules are relevant
    });

    // Filter out dates that match existing schedules
    const updatedSchedule = expandedSchedule.filter(date => {
      return !existingSchedules.some((schedule: { date: { toDateString: () => string; }; }) => {
        return schedule.date.toDateString() === date.toDateString();
      });
    });

  // return updatedSchedule;


   
   return  res.json({ success: true, message: 'Events retrieved successfully', data: updatedSchedule });
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const isDateInExpandedSchedule = async (req: any, res: Response) => {
  try {
    const { dateToCheck, startDate, availabilityDays } = req.body;
    const contractorId = req.contractor.id;

    // Check if the date falls within the expanded schedule
    const expandedSchedule = generateExpandedSchedule(startDate, availabilityDays);
    const isDateInExpandedSchedule =   expandedSchedule.some( (date: Date) => dateToCheck.toDateString() === date.toDateString());
   
    res.json({ success: true, message: 'Events retrieved successfully', data: '' });
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




// Helper function to generate the expanded schedule based on availability days
const generateExpandedSchedule = function (startDate: Date, availabilityDays: any) {

  startDate = new  Date()
  const expandedSchedule = [];
  const year = startDate.getFullYear();

  // Iterate over each weekday in the availability days array
  for (const day of availabilityDays) {
    // let currentDate = new Date(startDate); // Start from the provided date
    let currentDate = startDate; // Start from the provided date

    // Find all occurrences of the current weekday in the year
    while (currentDate.getFullYear() === year) {
      if (currentDate.toLocaleString('en-us', { weekday: 'long' }) === day) {
        expandedSchedule.push(new Date(currentDate)); // Add the date to the expanded schedule
      }

      // Move to the next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  return expandedSchedule;
};


export const ScheduleContractor = {
  createSchedule,
  getSchedules,
  getSchedulesByDate,
  addOrUpdateSchedule,
  getEventsByMonth,
  expandWeeklyAvailability,
  isDateInExpandedSchedule
}



