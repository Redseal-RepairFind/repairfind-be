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
            to: reciever,
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


export const incommingCallController = async (
  req: any,
  res: Response,
) => {

  try {
    const { 
      
     } = req.body;

      const { tripDayId } = req.params;
      const { verificationCode } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const twiml = new twilio.twiml.VoiceResponse();
      // Check if the call was answered
      if (req.body.CallStatus === 'completed') {
        // Call was completed, no action needed
        twiml.hangup(); // Hang up the call
      } else {
        // An error occurred during the call
        twiml.say('An application error has occurred. Goodbye.'); // Say a goodbye message
        twiml.hangup(); // Hang up the call
      }
      res.type('text/xml');
      res.send(twiml.toString());
    
  } catch (err: any) {
    console.log("error", err)
    res.status(500).json({ message: err.message });
  }

}

export const callServiceController = {
    callController,
    incommingCallController
};
