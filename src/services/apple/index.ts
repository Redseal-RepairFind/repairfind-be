import { BadRequestError } from '../../utils/custom.errors';
import axios from 'axios';
import jwt from "jsonwebtoken";
import appleSignin from 'apple-signin-auth'

export async function getUserInfo(idToken: string): Promise<any> {
  try {
    if (!idToken) {
      throw new BadRequestError('Must pass idToken');
    }

    const providerUser = await axios.get('https://appleid.apple.com/auth/userinfo', {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    return providerUser.data;
  } catch (error: any) {
    // console.error('Error getting Apple user:', error);
    throw new BadRequestError(error.message, error); // You might want to handle or log the error accordingly
  }
}

// export async function verifyIdToken(idToken: string): Promise<any> {
//   try {
//     if (!idToken) {
//       throw new BadRequestError('Must pass idToken');
//     }

//     const applePublicKey = await axios.get(`https://appleid.apple.com/auth/keys`);

//     console.log(applePublicKey)
//     const decoded = jwt.verify(idToken, applePublicKey.data.keys[0], { algorithms: ['RS256'] });

//     return decoded;
//   } catch (error: any) {
//     // console.error('Error getting Apple user:', error);
//     throw new BadRequestError(error.message, error); // You might want to handle or log the error accordingly
//   }
// }

export async function verifyIdToken(idToken: string): Promise<any> {
    try {
        const verifiedToekn = await appleSignin.verifyIdToken(idToken, {
          ignoreExpiration: true, // default is false
        });
        // console.log(verifiedToekn)
        return verifiedToekn
      } catch (err) {
        // Token is not verified
        console.error(err);
      }
}

export async function decodeAccessToken(accessToken: string): Promise<any> {
    try {
        const decodedToken = jwt.decode(accessToken);
        return decodedToken;
    } catch (error) {
        console.error('Error decoding access token:', error);
        throw error;
    }
}

export const AppleIdServiceProvider = {
  getUserInfo,
  verifyIdToken
};
