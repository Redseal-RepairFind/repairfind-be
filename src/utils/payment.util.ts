

const calculateCharges = async (totalEstimateAmount: number) => {
    let subtotal, repairfindServiceFee, gstAmount, totalAmount,customerPayable, contractorPayable, customerProcessingFee, contractorProcessingFee, siteVisitAmount = 0;
    
    let repairfindServiceFeeRate, customerProcessingFeeRate, contractorProcessingFeeRate, gstRate;

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
    customerProcessingFee = parseFloat(((customerProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
    contractorProcessingFee = parseFloat(((contractorProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
    gstAmount = parseFloat(((gstRate / 100) * totalEstimateAmount).toFixed(2));
    
    subtotal = totalEstimateAmount;
    customerPayable = parseFloat((subtotal + customerProcessingFee + gstAmount ).toFixed(2));
    contractorPayable = parseFloat(((subtotal + gstAmount )- (contractorProcessingFee +repairfindServiceFee)).toFixed(2));

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
        
    };
};



export const PaymentUtil = {
    calculateCharges
}