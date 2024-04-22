import AdminModel from "../admin/models/admin.model";
import { CustomerAuthProviders } from "../customer/interface/customer.interface";
import CustomerModel from "../customer/models/customer.model";


const customers  = [
    {
        email: 'admin@repairfind.com',
        password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y', // password
        firstName: 'Repair',
        lastName: 'Admin',
        superAdmin: true,
        validation: true,
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
      },
]


export  const AdminSeeder  = async (options: Object) => {
        try {
            customers.forEach(async (admin) => {
                await AdminModel.findOneAndUpdate({ email: admin.email }, admin, { upsert: true });
            });

        } catch (error) {
            console.log("Error seeding admins", error)
        }
  };


