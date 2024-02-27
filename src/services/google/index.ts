import { BadRequestError } from '../../utils/custom.errors';
import axios from 'axios';

export async function getUserInfo(googleAccessToken: string): Promise<any> {
  try {
    
    if (!googleAccessToken) {
        throw new BadRequestError('Must pass google access token')
    }

    const providerUser = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${googleAccessToken}`
        }
    });

   
    return providerUser.data
  } catch (error) {
    console.error('Error getting google user :', error);
    throw error; // You might want to handle or log the error accordingly
  }
}
export const GoogleServiceProvider = {
  getUserInfo
}
