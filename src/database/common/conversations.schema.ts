import mongoose, { Document, ObjectId, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { MessageModel, MessageType } from './messages.schema';
import { BlockedUserUtil } from '../../utils/blockeduser.util';

export enum ConversationEntityType {
    BOOKING = 'bookings',
    JOB = 'jobs',
    QUOTATION = 'job_quotations',
}

export enum CONVERSATION_TYPE {
    DIRECT_MESSAGE = 'DIRECT_MESSAGE',
    GROUP_CHAT = 'GROUP_CHAT',
    TICKET = 'TICKET',
}

export interface IConversation extends Document {
    _id: ObjectId;
    members: [{
        member: ObjectId,
        memberType: string
    }]
    lastMessageAt: Date;
    type: string;
    lastMessage: string;
    isBlockedBy?: string;
    entity: ObjectId
    entityType: ConversationEntityType
    heading: Object;


    getHeading: (loggedInUserId: any) => {
        name: string;
        image: string;
        lastMessage: string;
        lastMessageAt: string;
        unreadCount: number;
        language: string;
    };
    getIsBlocked:  () => {}
}

const ConversationSchema = new mongoose.Schema<IConversation>({

    members: [{ member: { type: Schema.Types.ObjectId, refPath: 'members.memberType' }, memberType: String }],
    entity: {
        type: Schema.Types.ObjectId,
        refPath: 'entityType',
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(CONVERSATION_TYPE),
        default: CONVERSATION_TYPE.DIRECT_MESSAGE
    },
    entityType: {
        type: String,
        enum: Object.values(ConversationEntityType)
    },

    heading: {
        type: Object
    },
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: Date
    },
    isBlockedBy: {
        type: String,
        default: null,
    }
},
    {
        toObject: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            }
        },
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            }
        },
        timestamps: true,
        versionKey: false
    }
);


// Define a schema method to get the heading
ConversationSchema.methods.getHeading = async function (loggedInUserId: string) {
    const otherMember = this.members.find((member: { member: { toString: () => string; }; }) => member.member.toString() !== loggedInUserId);
    if (otherMember) {
        let UserModel = mongoose.model('contractors');
        if (otherMember.memberType == 'contractors') {
            UserModel = mongoose.model('contractors');
        }
        if(otherMember.memberType == 'customers') {
            UserModel = mongoose.model('customers')
        }
        if(otherMember.memberType == 'admins'){
            UserModel = mongoose.model('admins'); // Assuming your user model is named 'User'
        }
        const otherMemberUser = await UserModel.findById(otherMember.member);
        const lastMessage = await MessageModel.findOne({ conversation: this._id, messageType: MessageType.TEXT }).sort({ createdAt: -1 });


        // get messages in which  read by loggedInUserId does not exist in the array
        const unreadCount = await MessageModel.countDocuments({ conversation: this._id, readBy: { $ne: loggedInUserId } });


        if (otherMemberUser) {
            return {
                name: otherMemberUser.name,
                image: otherMemberUser.profilePhoto?.url ?? otherMemberUser.profilePhoto,
                lastMessage: lastMessage?.message,
                lastMessageAt: lastMessage?.createdAt,
                unreadCount: unreadCount,
                language: otherMemberUser.language,
            };
        }
    }
};


ConversationSchema.methods.getIsBlocked = async function () {
    const conversationMembers = this.members
    
    let contractor = conversationMembers[1].member
    let customer = conversationMembers[0].member

    if(conversationMembers[0].memberType == 'customers' ){
        customer = conversationMembers[0].member
    }else{
        customer = conversationMembers[1].member
    }

    if(conversationMembers[0].memberType == 'contractors' ){
        contractor = conversationMembers[0].member
    }else{
        contractor = conversationMembers[1].member
    }

    const {isBlocked, block} = await BlockedUserUtil.isUserBlocked({customer, contractor})
    return block?.blockedBy

};






export const ConversationModel = model<IConversation>('conversations', ConversationSchema);




