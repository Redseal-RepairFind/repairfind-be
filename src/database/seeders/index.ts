import { ContractorSeeder } from "./contractor.seeder";
import { CustomerSeeder } from "./customer.seeder";
import { AdminSeeder } from "./admin.seeder";


export const RunSeeders = async () =>{
    CustomerSeeder({ordered:true})
    ContractorSeeder({ordered:false})
    AdminSeeder({ordered:false})
}