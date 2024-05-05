import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from 'agora-access-token';
import { config } from '../../config';

class AgoraTokenService {
  static async generateRtcToken(channelName: string, role: string, uid: number = 0,   expireTime: number = 86400): Promise<string> {
    try {

        console.log(channelName, uid, role)
        let rtcRole = RtcRole.PUBLISHER
        if(role == 'publisher'){
            rtcRole = RtcRole.PUBLISHER
        };
        if(role == 'audience'){
            rtcRole = RtcRole.SUBSCRIBER
        };

        if (!expireTime || expireTime == 0) {
          expireTime = 86400;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTime + expireTime;


      const token = RtcTokenBuilder.buildTokenWithUid(
        config.agora.appId,
        config.agora.appCertificate,
        channelName,
        uid,
        rtcRole,// Adjust role according to your requirements
        privilegeExpiredTs
      );
      console.log('RTC Token generated successfully');
      return token;
    } catch (error) {
      console.error('Error generating RTC token:', error);
      throw error;
    }
  }

  static async generateRtmToken(uid: number = 0, expireTime: number = 86400): Promise<string> {
    try {

      if (!expireTime || expireTime == 0) {
        expireTime = 86400;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTime + expireTime;


      const token = RtmTokenBuilder.buildToken(
        config.agora.appId,
        config.agora.appCertificate,
        uid,
        RtmRole.Rtm_User, // Adjust role according to your requirements
        privilegeExpiredTs
      );
      console.log('RTM Token generated successfully');
      return token;
    } catch (error) {
      console.error('Error generating RTM token:', error);
      throw error;
    }
  }
}

export default AgoraTokenService;
