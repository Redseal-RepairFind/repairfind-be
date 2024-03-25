

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';
import { bool } from 'aws-sdk/clients/signer';
import { transferFileToS3, transferFileToS3Sync } from '../storage';
import axios from 'axios';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_IDENTITY_API_RK;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);





export const createFileLink = async (payload: any, uploadtoS3: bool = false) => {
  try {
    let fileLink =  await stripeClient.fileLinks.create(payload)
    let s3fileUrl = ''
    if(fileLink && fileLink.url && uploadtoS3){
        let url  =  fileLink.url  //'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8yOF9mZW1hbGVfbWluaW1hbF9yb2JvdF9mYWNlX29uX2RhcmtfYmFja2dyb3VuZF81ZDM3YjhlNy04MjRkLTQ0NWUtYjZjYy1hZmJkMDI3ZTE1NmYucG5n.png' //fileLink.url
        s3fileUrl = await transferFileToS3Sync(url, fileLink.url)
        // console.log('createFileLink transfered to s3. ', s3fileUrl)
    }
    return {fileLink, s3fileUrl}
  } catch (error:any) {
        throw new BadRequestError(error.message || "Something went wrong");
  }
};





