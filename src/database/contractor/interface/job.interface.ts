import { Document, Types, ObjectId } from "mongoose";
import { IContractor } from "./contractor.interface";
import { ICustomer } from "../../customer/interface/customer.interface";

interface Quate {
  material: string;
  qty: number;
  rate: number;
  //tax: number
  amount: number
  
}

interface Qoute {
  materialDetail: string;
  totalcostMaterial: number;
  workmanShip: number
  
}

export interface IJob extends Document {
  _id: ObjectId;
  contractorId: IContractor['_id'];
  customerId: ICustomer['_id'];

  time: Date;
  description: string;
  address: string;
  image: string[];
  postalCode: string;
  jobTitle: string;

  inspection: {
    status: boolean;
    confirmPayment: boolean;
  };

  status: string;

  totalQuatation: number;
  gst: number;
  companyCharge: number;
  totalAmountCustomerToPaid: number;
  totalAmountContractorWithdraw: number;

  rejected: boolean;
  rejectedReason: string[];

  quate: Quate[];
  workmanShip: number;

  qoute: {
    materialDetail: string;
    totalcostMaterial: number;
    workmanShip: number
  };

  createdAt: Date;
  updatedAt: Date;
}
