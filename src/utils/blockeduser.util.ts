import mongoose, { ObjectId } from "mongoose";
import { BlockedUserModel } from "../database/common/blocked_users.model";

const isUserBlocked = async (userOne: ObjectId, userOneType: string, userTwo: ObjectId, userTwoType: string) => {
    try {
        // Check if either userOne has blocked userTwo or userTwo has blocked userOne
        const block = await BlockedUserModel.findOne({
            $or: [
                {
                    user: userOne,
                    blockedUser: userTwo,
                    userType: userOneType,
                    blockedUserType: userTwoType
                },
                {
                    user: userTwo,
                    blockedUser: userOne,
                    userType: userTwoType,
                    blockedUserType: userOneType
                }
            ]
        }).exec();

        // Return true if a block exists, otherwise false
        return !!block;
    } catch (error) {
        console.error("Error checking if users are blocked:", error);
        throw new Error("Could not check block status");
    }
};

export const BlockedUserUtil = {
    isUserBlocked,
};
