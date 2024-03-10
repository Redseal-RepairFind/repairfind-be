import { CustomerAuthProviders } from "../customer/interface/customer.interface";
import CustomerModel from "../customer/models/customer.model";


const customers  = [
    {
        email: 'customer@repairfind.com',
        password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y', // password
        firstName: 'Customer',
        lastName: 'User',
        phoneNumber: {
            "code": "+123",
            "number": "3242342324"
        },
        location: 'Some Location',
        passwordOtp: {
            verified: true,
        },
        emailOtp: {
            verified: true,
        },
        phoneNumberOtp: {
            verified: true
        },
        profilePhoto: {
            url: "https://dsfds"
        },
        acceptTerms: true,
        provider: CustomerAuthProviders.PASSWORD
      },
]


export  const CustomerSeeder  = async (options: Object) => {
        try {
            customers.forEach(async (customer) => {
                await CustomerModel.findOneAndUpdate({ email: customer.email }, customer, { upsert: true });
            });

        } catch (error) {
            console.log("Error seeding challenge tags", error)
        }
  };


