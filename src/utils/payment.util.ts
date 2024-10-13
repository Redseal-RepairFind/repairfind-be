import { ObjectId } from "mongoose";
import { COUPON_VALUE_TYPE, CouponModel } from "../database/common/coupon.schema";

const calculateCharges = async ({
    totalEstimateAmount,
    customerDiscount,
    contractorDiscount,
  }: {
    totalEstimateAmount: number;
    customerDiscount?: { value: number; valueType: COUPON_VALUE_TYPE, coupon?: ObjectId };
    contractorDiscount?: { value: number; valueType: COUPON_VALUE_TYPE, coupon?: ObjectId };
  }) => {
    let [
      subtotal,
      repairfindServiceFee,
      gstAmount,
      totalAmount,
      customerPayable,
      contractorPayable,
      customerProcessingFee,
      contractorProcessingFee,
      siteVisitAmount,
      customerDiscountValue,
      contractorDiscountValue,
      repairfindServiceFeeRate,
      customerProcessingFeeRate,
      contractorProcessingFeeRate,
      gstRate,
    ] = Array(15).fill(0);
  
    // Set service fee rates based on total estimate amount
    if (totalEstimateAmount <= 5000) {
      repairfindServiceFeeRate = 10;
    } else if (totalEstimateAmount <= 10000) {
      repairfindServiceFeeRate = 8;
    } else {
      repairfindServiceFeeRate = 5;
    }
  
    customerProcessingFeeRate = 3;
    contractorProcessingFeeRate = 3;
    gstRate = 5;
  
  
    // Concurrently fetch customer and contractor coupons (if any)
    const [customerCoupon, contractorCoupon] = await Promise.all([
      customerDiscount?.coupon ? CouponModel.findById(customerDiscount.coupon).select('type _id name') : null,
      contractorDiscount?.coupon ? CouponModel.findById(contractorDiscount.coupon).select('type _id name') : null
    ]);
  
    // Calculate customer discount based on valueType
    if (customerDiscount) {
      if (customerDiscount.valueType === COUPON_VALUE_TYPE.FIXED) {
        customerDiscountValue = customerDiscount.value;
      } else if (customerDiscount.valueType === COUPON_VALUE_TYPE.PERCENTAGE) {
        customerDiscountValue = parseFloat(
          ((customerDiscount.value / 100) * totalEstimateAmount).toFixed(2)
        );
      }
      // Ensure discount doesn't exceed total amount
      customerDiscountValue = Math.min(customerDiscountValue, totalEstimateAmount);
    }
  
    // Calculate contractor discount based on valueType
    if (contractorDiscount) {
      if (contractorDiscount.valueType === COUPON_VALUE_TYPE.FIXED) {
        contractorDiscountValue = contractorDiscount.value;
      } else if (contractorDiscount.valueType === COUPON_VALUE_TYPE.PERCENTAGE) {
        contractorDiscountValue = parseFloat(
          ((contractorDiscount.value / 100) * repairfindServiceFeeRate).toFixed(2)
        );
      }
  }

  
    repairfindServiceFeeRate -= contractorDiscountValue
    repairfindServiceFee = parseFloat(((repairfindServiceFeeRate / 100) * totalEstimateAmount).toFixed(2)).toFixed(2);


    customerProcessingFee = parseFloat(((customerProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
    contractorProcessingFee = parseFloat(((contractorProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
    gstAmount = parseFloat(((gstRate / 100) * totalEstimateAmount).toFixed(2));
    subtotal = totalEstimateAmount;
  
    customerPayable = parseFloat((subtotal + customerProcessingFee + gstAmount - customerDiscountValue).toFixed(2));
    contractorPayable = parseFloat((subtotal + gstAmount - (contractorProcessingFee + repairfindServiceFee) ).toFixed(2));
      

    
    return {
      subtotal,
      gstAmount,
      customerPayable,
      contractorPayable,
      repairfindServiceFee,
      customerProcessingFee,
      contractorProcessingFee,
    
      // Return rates as well
      gstRate,
      repairfindServiceFeeRate,
      contractorProcessingFeeRate,
      customerProcessingFeeRate,
    
      // Correctly apply customer and contractor discounts
      customerDiscount: customerDiscount?.value
        ? { 
            coupon: customerCoupon,
            amount: customerDiscountValue, 
            value: customerDiscount.value, 
            valueType: customerDiscount.valueType, 
            appliedOn: 'totalEstimateAmount'  // Indicating where it was applied
          }
        : null,
      contractorDiscount: contractorDiscount?.value
        ? { 
            coupon: contractorCoupon,
            amount: repairfindServiceFee, 
            value: contractorDiscount.value, 
            valueType: contractorDiscount.valueType, 
            appliedOn: 'repairfindServiceFee'  // Indicating where it was applied
          }
        : null,
    };
  };
  
export const PaymentUtil = {
    calculateCharges,
};
