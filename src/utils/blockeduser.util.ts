import mongoose, { ObjectId } from "mongoose";
import { BlockedUserModel } from "../database/common/blocked_users.model";

// Define a type for the input parameters
type BlockCheckParams = {
    customer: ObjectId;
    contractor: ObjectId;
}

const isUserBlocked = async ({ customer, contractor }: BlockCheckParams) => {
    try {
        const block = await BlockedUserModel.findOne({
            customer: customer,
            contractor: contractor,
        }).exec();

        const isBlocked = !!block
        return {isBlocked, block};
    } catch (error) {
        console.error("Error checking if users are blocked:", error);
        throw new Error("Could not check block status");
    }
};

export const BlockedUserUtil = {
    isUserBlocked,
};
