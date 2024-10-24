import AdminModel from "../admin/models/admin.model";

const admins  = [
    {
        email: 'admin@repairfind.ca',
        password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
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
            url: "https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" 
        },
        acceptTerms: true,
        hasWeakPassword: true,
      },
]


export  const AdminSeeder  = async (options: Object) => {
        try {
            admins.forEach(async (admin) => {
                const existingAdmin= await AdminModel.findOne({ email: admin.email });
                if(existingAdmin)return 
                await AdminModel.findOneAndUpdate({ email: admin.email }, admin, { upsert: true });
            });

        } catch (error) {
            console.log("Error seeding admins", error)
        }
  };


