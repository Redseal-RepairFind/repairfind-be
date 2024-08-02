import { Document, Schema, Types, model } from 'mongoose';

// Interface for the Recurrence schema
export interface IRecurrence {
  frequency?: string;
  interval?: number;
}

// Interface for the Event schema
export interface IEvent {
  date?: Date;
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  type?: string;
  booking: number;
  note?: string;
  title?: string;
  reminder?: string;
}

// Interface for the ContractorSchedule document
export interface IContractorSchedule {
  contractor?: Types.ObjectId;
  date: Date;
  type: string;
  startTime?: string | undefined;
  endTime?: string | undefined;
  recurrence?: IRecurrence;
  events?: Array<IEvent>;
  originalSchedule?: Types.ObjectId; // Reference to the original schedule
}

// Mongoose schema for the Recurrence
const RecurrenceSchema = new Schema<IRecurrence>({
  frequency: {
    type: String,
  },
  interval: {
    type: Number,
  },
});

// Mongoose schema for the Event
const EventSchema = new Schema<IEvent>({
  type: {
    type: String,
  },
  booking: {
    type: Number,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  note: {
    type: String,
  },
  title: {
    type: String,
  },
  reminder: {
    type: String
  },
});

// Mongoose schema for the ContractorSchedule
const ContractorScheduleSchema = new Schema<IContractorSchedule>({
  contractor: {
    type: Schema.Types.ObjectId,
    ref: 'contractors',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  type: {
    type: String,
  },
  recurrence: RecurrenceSchema,
  events: [EventSchema],
  originalSchedule: {
    type: Schema.Types.ObjectId,
    ref: 'contractor_schedules',
  },

});



ContractorScheduleSchema.statics.handleRecurringEvents = async function (
  scheduleId: Types.ObjectId
) {
  const originalSchedule = await this.findById({ _id: scheduleId });

  if (!originalSchedule) {
    console.log('Original schedule not found', scheduleId);
    return [];
  }

  // Delete existing recurrent schedules with the same originalScheduleId
  // await this.deleteMany({ originalSchedule: scheduleId });

  let { frequency } = originalSchedule.recurrence;

  // Create new schedules based on the recurrence rules
  for (let i = 1; i <= 400; i++) {
    const newDate = new Date(originalSchedule.date);


    // Adjust the date based on the recurrence frequency
    switch (frequency) {
      case 'Daily':
        newDate.setDate(newDate.getDate() + i);
        break;
      case 'Weekly':
        newDate.setDate(newDate.getDate() + i * 7);
        break;
      case 'Monthly':
        newDate.setMonth(newDate.getMonth() + i);
        break;
      // Add more cases for other recurrence frequencies as needed
    }

    // Check if the new date is within the same year as the original schedule's date
    if (newDate.getFullYear() == originalSchedule.date.getFullYear()) {
      await this.findOneAndUpdate({ contractor: originalSchedule.contractor, date: newDate }, {
        contractor: originalSchedule.contractor,
        date: newDate,
        type: originalSchedule.type,
        originalSchedule: scheduleId, // Set reference to the original schedule
      }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
  }

};




// Post hook for save method
ContractorScheduleSchema.post<IContractorSchedule>('save', async function (doc) {
  // @ts-ignore
  if (doc.recurrence) {
    // @ts-ignore
    await doc.constructor.handleRecurringEvents(doc._id);
  }

  // doc.
  // @ts-ignore
  // console.log(doc.constructor.activeCampaignsToRedis)
  return
});

export const ContractorScheduleModel = model<IContractorSchedule>('contractor_schedules', ContractorScheduleSchema);





// Helper function to generate the expanded schedule based on availability days
const generateExpandedSchedule = function (startDate: Date, availabilityDays: any) {
  const expandedSchedule = [];
  const year = startDate.getFullYear();

  // Iterate over each weekday in the availability days array
  for (const day of availabilityDays) {
    let currentDate = new Date(startDate); // Start from the provided date

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

// Method to expand weekly availability for a whole year based on an array of week days
ContractorScheduleSchema.statics.expandWeeklyAvailability = async function (startDate: Date, availabilityDays: string[]) {
  const expandedSchedule = generateExpandedSchedule(startDate, availabilityDays);

  // Fetch existing schedules within the specified timeframe
  const existingSchedules = await this.find({
    date: { $gte: startDate },
    recurrence: { frequency: 'Weekly' }, // Assuming only weekly schedules are relevant
  });

  // Filter out dates that match existing schedules
  const updatedSchedule = expandedSchedule.filter(date => {
    return !existingSchedules.some((schedule: { date: { toDateString: () => string; }; }) => {
      return schedule.date.toDateString() === date.toDateString();
    });
  });

  return updatedSchedule;
};

// Method to check if a given date falls within the expanded schedule
ContractorScheduleSchema.statics.isDateInExpandedSchedule = function (dateToCheck, expandedSchedule) {
  // Check if the date falls within the expanded schedule
  return expandedSchedule.some((date: Date) => dateToCheck.toDateString() === date.toDateString());
};
