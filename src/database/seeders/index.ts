import { ContractorSeeder } from "./contractor.seeder";
import { CustomerSeeder } from "./customer.seeder";


export const RunSeeders = async () =>{
    CustomerSeeder({ordered:true})
    ContractorSeeder({ordered:false})
}