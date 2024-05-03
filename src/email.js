const AWS = require('aws-sdk');

const ses_config = {
    accessKeyId: 'AKIA2UC276SLKSO3ANGR',
    secretAccessKey: '1jm/o9Iw1LXwbfYuPokKFNb/KbsDnJdM1yQmPvaW',
    region: 'eu-north-1' // e.g., 'us-west-2'
};

const ses = new AWS.SES(ses_config);

const sendEmail = async (to, subject, body) => {
    const params = {
        Destination: {
            ToAddresses: ['admin@repairfind.ca']
        },
        Message: {
            Body: {
                Text: { Data: body }
            },
            Subject: { Data: subject }
        },
        Source: 'admin@repairfind.ca' // This must be a verified email address in SES
    };

    try {
        const data = await ses.sendEmail(params).promise();
        console.log("Email sent:", data);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

// Example usage
sendEmail('noreply@repairfind.ca', 'Test Subject', 'This is a test email from AWS SES.');