import { ContractorSeeder } from "./contractor.seeder";
import { CustomerSeeder } from "./customer.seeder";
import { AdminSeeder } from "./admin.seeder";
import { CountrySeeder } from "./country.seeder";
import { BankSeeder } from "./bank.seeder";


export const RunSeeders = async () =>{
    CustomerSeeder({ordered:true})
    ContractorSeeder({ordered:false})
    AdminSeeder({ordered:false})
    CountrySeeder({ordered:false})
    BankSeeder({ordered:false})
}