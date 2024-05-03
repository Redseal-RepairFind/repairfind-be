import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from 'agora-access-token';
import { config } from '../../config';

class AgoraTokenService {
  static async generateRtcToken(channelName: string, uid: number, role: string,  privilegeExpiredTs: number = 0): Promise<string> {
    try {

        console.log(channelName, uid, role)
        let rtcRole = RtcRole.PUBLISHER
        if(role == 'publisher'){
            rtcRole = RtcRole.PUBLISHER
        };
        if(role == 'audience'){
            rtcRole = RtcRole.SUBSCRIBER
        };
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

  static async generateRtmToken(uid: number, privilegeExpiredTs: number = 0): Promise<string> {
    try {
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
