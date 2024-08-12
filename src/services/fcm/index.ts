import admin from 'firebase-admin';
import axios from 'axios';
import { config } from '../../config';
import { JWT } from 'google-auth-library';



const initializeFirebase = async () => {
    try {
        const { data: serviceAccount } = await axios.get(config.google.serviceJson);
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('Firebase Admin SDK initialized');
    } catch (error) {
        console.error('Error fetching service account JSON:', error);
    }
};

const sendWebNotification = async (FcmToken: any) => {
    try {
        const message = {
            tokens: [FcmToken],
            data: {
                title: 'req.body.title',
                body: 'req.body.body',
                icon: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/2048px-Facebook_f_logo_%282021%29.svg.png",
                click_action: "http://localhost:8081"
            }
        };

        const response = await admin.messaging().sendMulticast(message);
        console.log(response);
        return response;
    } catch (error) {
        console.log('Error sending notification', error);
    }
};

initializeFirebase();



export default sendWebNotification;
