import { ObjectId } from "mongoose";
import { IContractor } from "../database/contractor/interface/contractor.interface";
import { IContractorProfile } from "../database/contractor/interface/contractor_profile.interface";
import { ContractorProfileModel } from "../database/contractor/models/contractor_profile.model";
import { IContractorSchedule } from "../database/contractor/models/contractor_schedule.model";

export const generateExpandedSchedule = function (availabilityDays: Array<string>, year?: string) {

    const expandedSchedule: IContractorSchedule[] = [];
    let currentYear = new Date().getFullYear();

   
    if(year){
        currentYear = new Date(`${year}-01-02`).getFullYear();
    }

   
    // Iterate over each weekday in the availability days array
    availabilityDays.forEach(day => {

        let currentDate = firstWeekdayDate(day, year)

        if (!currentDate) {
            return
        }

        
        // Find all occurrences of the current weekday in the year
        while (currentDate.getFullYear() === currentYear) {
            if (currentDate.toLocaleString('en-us', { weekday: 'long' }) === day) {
                expandedSchedule.push({
                    date: new Date(currentDate),
                    type: 'available',
                });
            }

            // Move to the next week
            currentDate.setDate(currentDate.getDate() + 7);
        }
    })
    return expandedSchedule;
};


export const isDateInExpandedSchedule = async (dateToCheck: any, contractorId: any) => {
    try {

        // example
        // let dateToCheck = new Date('2024-12-08T23:00:00.000Z')

        let contractor  = await ContractorProfileModel.findOne({contractor: contractorId})
        if(!contractor) return false
        let availabilityDays = contractor.availability.map(availability =>{
            return availability.day
        }) ?? []

        // Check if the date falls within the expanded schedule
        const expandedSchedule = generateExpandedSchedule(availabilityDays);
        const isDateInExpandedSchedule = expandedSchedule.some((schedule: any) => dateToCheck.toDateString() === schedule.date.toDateString());
        return isDateInExpandedSchedule
    } catch (error) {
        console.error('Error checking for date in schedule:', error);
        return
    }
};

// Function to get all contractors with a date in their expanded schedule
export const getContractorsWithDateInSchedule = async (dateToCheck: Date): Promise<IContractorProfile[]> => {
    try {
        // Find all contractors
        const contractors = await ContractorProfileModel.find({});
        const contractorsWithDateInSchedule: IContractorProfile[] = [];
        
        // Iterate over each contractor
        for (const contractor of contractors) {
            // Check if the date falls within the contractor's expanded schedule
            const isInSchedule = await isDateInExpandedSchedule(dateToCheck, contractor._id);
            if (isInSchedule) {
                contractorsWithDateInSchedule.push(contractor);
            }
        }
        return contractorsWithDateInSchedule;
    } catch (error) {
        console.error('Error retrieving contractors with date in schedule:', error);
        return [];
    }
};

export const getContractorIdsWithDateInSchedule = async (dateToCheck: Date): Promise<ObjectId[]> => {
    try {
        // Find all contractors
        const profiles = await ContractorProfileModel.find({});
        const contractorsWithDateInSchedule: ObjectId[] = [];

        // console.log(profiles)
        
        // Iterate over each contractor
        for (const profile of profiles) {
            // Check if the date falls within the contractor's expanded schedule
            const isInSchedule = await isDateInExpandedSchedule(dateToCheck, profile.contractor);
            if (isInSchedule) {
                contractorsWithDateInSchedule.push(profile.contractor);
            }
        }
        return contractorsWithDateInSchedule;
    } catch (error) {
        console.error('Error retrieving contractors with date in schedule:', error);
        return [];
    }
};



function firstWeekdayDate(day: string, year?:string): Date | null {
    let today = new Date();
    if(year){
        today =new Date(`${year}-01-02`)
    }
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get the index of the specified day
    const dayIndex = weekdayNames.indexOf(day);
    if (dayIndex === -1) {
        console.error('Invalid day specified');
        return null;
    }

    // Start from the first day of the month and iterate until we find the first occurrence of the specified weekday
    let currentDate = new Date(firstDayOfMonth);
    while (currentDate.getDay() !== dayIndex) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // console.log(currentDate)
    return currentDate;
}