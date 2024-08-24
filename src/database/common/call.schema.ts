import mongoose, { Schema, Document } from 'mongoose';

export interface ICall {
  fromUser: string;
  fromUserType: string;
  toUser: string;
  toUserType: string;
  startTime: Date;
  endTime?: Date;
  durationSeconds?: number;
  callStatus?: 'answered' | 'missed' | 'declined' | 'ended';
  recordingUrl?: string;
  toUserToken: string;
  fromUserToken: string;
  uid: string;
  channel: string;
  heading: object;
  getHeading: (loggedInUserId: any) => {
  };
}


export const CallSchema: Schema = new Schema<ICall>({
  fromUser: { type: String, required: true },
  fromUserType: { type: String, required: true },
  toUser: { type: String, required: true },
  toUserType: { type: String, required: true },
  startTime: { type: Date, required: false },
  endTime: { type: Date, required: false },
  durationSeconds: { type: Number, required: false },
  callStatus: {
    type: String,
    enum: ['answered', 'missed', 'declined', 'ended'],
    required: false,
  },
  recordingUrl: { type: String },
  toUserToken: { type: String },
  fromUserToken: { type: String },
  uid: { type: String },
  channel: { type: String },
  heading: { type: Schema.Types.Mixed },
}, { timestamps: true });


// Define a schema method to get the heading
CallSchema.methods.getHeading = async function (loggedInUserId: string) {
  const otherMember = (this.fromUser == loggedInUserId) ? this.toUser : this.fromUser
  const otherMemberType = (this.fromUser == loggedInUserId) ? this.toUserType : this.fromUserType
  if (otherMember) {
    let UserModel = mongoose.model('contractors');
    if (otherMemberType == 'contractors') {
      UserModel = mongoose.model('contractors');
    }
    if (otherMemberType == 'customers') {
      UserModel = mongoose.model('customers')
    }
    if (otherMemberType == 'admins') {
      UserModel = mongoose.model('admins'); // Assuming your user model is named 'User'
    }
    const otherMemberUser = await UserModel.findById(otherMember);


    if (otherMemberUser) {
      return {
        name: otherMemberUser.name,
        image: otherMemberUser.profilePhoto?.url ?? otherMemberUser.profilePhoto,
      };
    }
  }
};




export const CallModel = mongoose.model<ICall>('calls', CallSchema);
