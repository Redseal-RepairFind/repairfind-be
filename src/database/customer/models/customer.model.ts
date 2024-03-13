import { Schema, model } from "mongoose";
import { CustomerAuthProviders, ICustomer } from "../interface/customer.interface";
import { StripeCustomerSchema } from "../../common/stripe_customer.schema";



const CustomerSchema = new  Schema <ICustomer>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
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
        type: String,
        default: "",
      },
      profilePhoto: {
        type: Object,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
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
      acceptTerms: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      provider: {
        type: String,
        enum: Object.values(CustomerAuthProviders),
        default:  CustomerAuthProviders.PASSWORD
      },

      stripeCustomer: StripeCustomerSchema
    
    },
    {
      timestamps: true,
    }
  );

  CustomerSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
  });
  
  
  CustomerSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passwordOtp;
        delete ret.phoneNumberOtp;
        //  @ts-ignore
        ret.name = doc.name;
        return ret;
    }
});




  const CustomerModel = model<ICustomer>("customers", CustomerSchema);
  
  export default CustomerModel;