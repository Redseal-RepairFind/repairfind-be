
import { Schema, model } from "mongoose";
import { CustomerAuthProviders, ICustomer, ICustomerLocation } from "../interface/customer.interface";
import { StripeCustomerSchema } from "../../common/stripe_customer.schema";
import { StripePaymentMethodSchema } from "../../common/stripe_paymentmethod.schema";
import  MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import { customerStatus } from "../../../constants/contractorStatus";
import { PaypalPaymentMethodSchema } from "../../common/paypal_paymentmethod.schema";
import { GeneratorUtil } from "../../../utils/generator.util";



const CustomerLocationSchema = new Schema<ICustomerLocation>({
  address: String,
  city: String,
  region: String,
  country: String,
  latitude: String,
  longitude: String,
});

const CustomerSchema = new Schema<ICustomer>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      verifiedAt: {type: Date, default: null },
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      code: {
        type: String
      },
      number: {
        type: String
      },
    },
    location: {
      type: CustomerLocationSchema,
    },
    profilePhoto: {
      type: Object,
      default: {url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'}
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
    },
    passwordOtp: {
      otp: String,
      createdTime: Date,
      verified: Boolean,
    },
    emailOtp: {
      otp: String,
      createdTime: Date,
      verified: Boolean,
    },
    phoneNumberOtp: {
      otp: String,
      createdTime: Date,
      verified: Boolean,
    },
    status: {
      type: String,
      enum: Object.values(customerStatus),
      default: customerStatus.REVIEWING,
    },
    acceptTerms: {
      otp: String,
      createdTime: Date,
      verified: Boolean,
    },
    provider: {
      type: String,
      enum: Object.values(CustomerAuthProviders),
      default: CustomerAuthProviders.PASSWORD
    },

    stripeCustomer: {
      type: StripeCustomerSchema,
    },
    stripePaymentMethods: {
      type: [StripePaymentMethodSchema],
    },
    paypalPaymentMethods: {
      type: [PaypalPaymentMethodSchema],
    },
    stripeAccount: {
      type: Object,
      default: null,
    },

    stripeIdentity: {
      type: Object,
    },
    currentTimezone: {
      type: String,
    },
    language: {
      type: String,
      default: 'en'
    },
    referralCode: {
      type: String,
    },
    referral: {
      type: Schema.ObjectId,
      ref: 'referrals',
    },

  },
  {
    timestamps: true,
  }
);



// Virtual fields
CustomerSchema.virtual('hasStripeIdentity').get(function (this: ICustomer) {
  return !!this.stripeIdentity; // Returns true if stripeIdentity exists, false otherwise
});

CustomerSchema.virtual('hasStripeCustomer').get(function (this: ICustomer) {
  return !!this.stripeCustomer; // Returns true if stripeCustomer exists, false otherwise
});

CustomerSchema.virtual('hasStripePaymentMethods').get(function (this: ICustomer) {
  return Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0; // Returns true if stripePaymentMethods is an array with at least one element
});

CustomerSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});


CustomerSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.emailOtp;
    delete ret.passwordOtp;
    delete ret.phoneNumberOtp;

    //@ts-ignore
    if (!options.includeStripeIdentity) {
      delete ret.stripeIdentity;
    }
     //@ts-ignore
    if (!options.includeStripePaymentMethods) {
      delete ret.stripePaymentMethods;
    }

    //@ts-ignore
    if (!options.includeStripeCustomer) {
      delete ret.stripeCustomer;
    }

     if (!ret.profilePhoto || !ret.profilePhoto.url) {
      ret.profilePhoto = {
        url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
      }
    }
    
    //@ts-ignore
    ret.name = doc.name;
    return ret;
  },
  virtuals: true
});

CustomerSchema.set('toObject', { virtuals: true });




CustomerSchema.plugin(MongooseDelete, { deletedBy: true , overrideMethods: 'all'});

const CustomerModel = model<ICustomer, SoftDeleteModel<ICustomer>>("customers", CustomerSchema);

export default CustomerModel;