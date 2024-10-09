const calculateCharges = async ({
    totalEstimateAmount,
    customerDiscount,
    contractorDiscount,
  }: {
    totalEstimateAmount: number;
    customerDiscount?: { value: number; valueType: 'fixed' | 'percentage' };
    contractorDiscount?: { value: number; valueType: 'fixed' | 'percentage' };
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
  
    repairfindServiceFee = parseFloat(((repairfindServiceFeeRate / 100) * totalEstimateAmount).toFixed(2));
  
    // Calculate customer discount based on valueType
    if (customerDiscount) {
      if (customerDiscount.valueType === 'fixed') {
        customerDiscountValue = customerDiscount.value;
      } else if (customerDiscount.valueType === 'percentage') {
        customerDiscountValue = parseFloat(
          ((customerDiscount.value / 100) * totalEstimateAmount).toFixed(2)
        );
      }
      // Ensure discount doesn't exceed total amount
      customerDiscountValue = Math.min(customerDiscountValue, totalEstimateAmount);
    }
  
    // Calculate contractor discount based on valueType
    if (contractorDiscount) {
      if (contractorDiscount.valueType === 'fixed') {
        contractorDiscountValue = contractorDiscount.value;
      } else if (contractorDiscount.valueType === 'percentage') {
        contractorDiscountValue = parseFloat(
          ((contractorDiscount.value / 100) * repairfindServiceFee).toFixed(2)
        );
      }
      // Ensure discount doesn't exceed total amount
      contractorDiscountValue = Math.min(contractorDiscountValue, repairfindServiceFee);
    }
  
    customerProcessingFee = parseFloat(((customerProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
    contractorProcessingFee = parseFloat(((contractorProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
    gstAmount = parseFloat(((gstRate / 100) * totalEstimateAmount).toFixed(2));
    subtotal = totalEstimateAmount;
  
    customerPayable = parseFloat((subtotal + customerProcessingFee + gstAmount - customerDiscountValue).toFixed(2));
    contractorPayable = parseFloat((subtotal + gstAmount - (contractorProcessingFee + (repairfindServiceFee - contractorDiscountValue)) ).toFixed(2));
  
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
        ? { amount: customerDiscountValue, value: customerDiscount.value, valueType: customerDiscount.valueType }
        : null,
      contractorDiscount: contractorDiscount?.value
        ? { amount: contractorDiscountValue, value: contractorDiscount.value, valueType: contractorDiscount.valueType  }
        : null,
    };
  };
  
  export const PaymentUtil = {
    calculateCharges,
  };
  