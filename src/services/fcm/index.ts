import admin from 'firebase-admin';
// import serviceAccount from '../../../fcm.json'; 

// Initialize the Firebase Admin SDKv
// admin.initializeApp({
//     credential: admin.credential.cert('serviceAccount' as admin.ServiceAccount)
// });

const sendWebNotification = async (FcmToken: any) => {
    // try {
    //     const message = {
    //         tokens: [FcmToken],
    //         data: {
    //             title: 'req.body.title',
    //             body: 'req.body.body',
    //             icon: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/2048px-Facebook_f_logo_%282021%29.svg.png",
    //             click_action: "http://localhost:8081"
    //         }
    //     };

    //     const response = await admin.messaging().sendMulticast(message);
    //     console.log(response);
    //     return response;
    // } catch (error) {
    //     console.log('Error sending notification', error);
    // }
};

export default sendWebNotification;
