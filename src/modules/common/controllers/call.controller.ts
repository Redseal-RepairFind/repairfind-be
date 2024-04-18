import { Request, Response } from "express";
import { validationResult } from "express-validator";
import twilio from "twilio";


export const callController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const { 
        caller,
        reciever
       } = req.body;

        const { tripDayId } = req.params;
        const { verificationCode } = req.body;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const accountSid = process.env.ACCOUNTSID;
        const authToken = process.env.AUTHTOKEN;

        const client = twilio(accountSid, authToken);

        const call =  await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml', // TwiML URL for the call
            // to: '+447492651487',
            to: '+17788989815',
            from: '+12514511899',
        })
        
        res.json({  
            success: true,
            message: `Call with SID ${call.sid} initiated.`,
            data: {}
        });
      
    } catch (err: any) {
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}

export const callServiceController = {
    callController
};
