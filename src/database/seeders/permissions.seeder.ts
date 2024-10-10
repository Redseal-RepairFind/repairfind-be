import PermissionModel from "../admin/models/permission.model";
import { BankModel } from "../common/bank.schema";

export const PermissionSeeder = async (options: Object) => {
    try {
        permissions.forEach(async (permission) => {
            const existingCountry = await BankModel.findOne({ name: permission.name });
            if (existingCountry) return
            await PermissionModel.findOneAndUpdate({ name: permission.name }, {
                name: permission.name,
                code: permission.name,
            }, { upsert: true });
        });
    } catch (error) {
        console.log("Error seeding permissions", error)
    }
};


const permissions = [
    { "name": "read_customer" },
    { "name": "update_customer" },
    { "name": "delete_customer" },
    { "name": "crud_customer" }, // all crud ops

    { "name": "read_contractor" }, 
    { "name": "update_contractor" }, 
    { "name": "delete_contractor" }, 
    { "name": "crud_contractor" }, 

    { "name": "read_emergency" }, 
    { "name": "update_emergency" }, 
    { "name": "delete_emergency" }, 
    { "name": "crud_emergency" }, 
    { "name": "resolve_emergency" }, 


    { "name": "resolve_dispute" }, 
    { "name": "update_dispute" }, 
    { "name": "read_dispute" }, 
    { "name": "delete_dispute" }, 
    { "name": "crud_dispute" }, 


    { "name": "resolve_dispute" }, 
    { "name": "update_dispute" }, 
    { "name": "read_dispute" }, 
    { "name": "delete_dispute" }, 
    { "name": "crud_dispute" }, 

    { "name": "create_job" }, 
    { "name": "update_job" }, 
    { "name": "read_job" }, 
    { "name": "delete_job" }, 
    { "name": "crud_job" }, 
    { "name": "enable_job_revisit" }, 


    { "name": "create_transaction" }, 
    { "name": "update_transaction" }, 
    { "name": "read_transaction" }, 
    { "name": "delete_transaction" }, 
    { "name": "crud_transaction" }, 

    { "name": "create_payment" }, 
    { "name": "update_payment" }, 
    { "name": "read_payment" }, 
    { "name": "delete_payment" }, 
    { "name": "crud_payment" }, 
    
]




