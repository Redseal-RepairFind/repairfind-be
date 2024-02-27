import { BadRequestError } from '../../utils/custom.errors';
import axios from 'axios';

export async function getFacebookUserInfo(facebookAccessToken: string): Promise<any> {
  try {
    if (!facebookAccessToken) {
      throw new BadRequestError('Must pass Facebook access token');
    }

    const providerUser = await axios.get('https://graph.facebook.com/v13.0/me', {
      params: {
        access_token: facebookAccessToken,
        fields: 'id,name,email,picture',
      },
    });

    return providerUser.data;
  } catch (error) {
    console.error('Error getting Facebook user:', error);
    throw error; // You might want to handle or log the error accordingly
  }
}


export const FacebookServiceProvider = {
  getFacebookUserInfo
}
