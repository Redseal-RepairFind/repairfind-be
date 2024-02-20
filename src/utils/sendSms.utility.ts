import { SendSms } from '../types/generalTypes';
import fetch from "node-fetch";

export const sendSms = ({to,sms}:SendSms)=>{
  const data = {
    to,
    from: "THERASWIFT",
    sms,
    type: "plain",
    api_key: process.env.TERMI_API_KEY,
    channel: "generic",
  };

  console.log(to)
  console.log(sms)
  
        
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
    
  fetch("https://api.ng.termii.com/api/sms/send", options)
  .then((response) => {
    console.log("sent message ", response.body);
  })
  .catch((error) => {
    console.error(error);
    throw error;
  }); 
}