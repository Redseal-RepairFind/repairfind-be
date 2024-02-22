import fetch from 'node-fetch';
import { config } from '../../config';

export async function initiateCertnInvite(data: Object): Promise<any> {
  try {

    let certnToken = config.certn.certnKey
    const options = {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${certnToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const certn = await fetch("https://api.certn.co/hr/v1/applications/invite/", options);
    const certnData = await certn.json();

    return certnData;
  } catch (error) {
    console.error('Error initiating Certn invite:', error);
    throw error; // You might want to handle or log the error accordingly
  }
}
