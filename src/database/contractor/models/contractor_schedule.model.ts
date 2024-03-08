import { Document, Schema, Types, model } from 'mongoose';

// Interface for the Recurrence schema
export interface IRecurrence {
  frequency?: string;
  interval?: number;
}

// Interface for the Event schema
export interface IEvent {
  date?: Date;
  startTime?: Date|undefined;
  endTime?: Date|undefined;
  type?: string;
  booking: number;
  note?: string;
  title?: string;
  reminder?: string;
}

// Interface for the ContractorSchedule document
export interface IContractorSchedule {
  contractor: Types.ObjectId;
  date: Date;
  type: string;
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
    type: Date,
  },
  endTime: {
    type: Date,
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
  originalScheduleId: Types.ObjectId
) {
  const originalSchedule = await this.findById({_id: originalScheduleId});

  if (!originalSchedule) {
    console.log('Original schedule not found', originalScheduleId);
    return [];
  }

   // Delete existing recurrent schedules with the same originalScheduleId
   await this.deleteMany({ originalSchedule: originalScheduleId });

  // const newSchedules: Document[] = [];

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
        const newSchedule = await this.create({
          contractor: originalSchedule.contractor,
          date: newDate,
          type: originalSchedule.type,
          // recurrence: originalSchedule.recurrence,
          originalSchedule: originalScheduleId, // Set reference to the original schedule
        });
  
        // console.log(i, originalScheduleId, originalSchedule.id, newSchedule.id)


        // newSchedules.push(newSchedule);
      }
      // return newSchedules;
    }

  // }

  // return newSchedules;
};




ContractorScheduleSchema.statics.activeCampaignsToRedis = function () {
  this
      .find()
      .where('active').equals(true)
};

// Post hook for save method
ContractorScheduleSchema.post<IContractorSchedule>('save', async function (doc) {
   // @ts-ignore
   if(!doc.originalSchedule){
    // @ts-ignore
    await doc.constructor.handleRecurringEvents(doc._id);
   }

  // doc.
  // @ts-ignore
  // console.log(doc.constructor.activeCampaignsToRedis)
  return
});

export const ContractorScheduleModel = model<IContractorSchedule>('contractor_schedules', ContractorScheduleSchema);
