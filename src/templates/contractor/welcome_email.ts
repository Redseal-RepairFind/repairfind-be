export const ContractorWelcomeTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>

    <style>
        /* Font import */
        @import url('https://fonts.googleapis.com/css2?family=Jost&display=swap');

        /* Email body styles */
        body {
            font-family: 'Jost', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        /* Wrapper styles */
        .email-wrapper {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        /* Header styles */
        .header {
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
        }

        /* Content styles */
        .content {
            padding: 30px;
        }



        /* Footer styles */
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <div class="header">
            <img  src="https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" alt="Repairfind Logo">
        </div>

        <div class="content">
            <h2 style="color: #333333;">Welcome to RepairFind!</h2>
            <p>Dear ${name},</p>

         
          <p>Welcome aboard RepairFind! We're thrilled to have you join our network of skilled contractors.</p>
          <p>Your registration marks the beginning of an exciting journey with us.</p>
          <p>Please note that as part of our commitment to providing a safe environment for all users, we partner with Certn, a background check service.</p>
          <p>Expect an email from Certn shortly, requesting some personal information to facilitate the background check process.</p>
          <p>Completing this process is crucial for the approval of your account on RepairFind, so please keep an eye on your inbox and respond promptly to Certn's email.</p>
          
          <p>If you have any questions or need assistance, feel free to contact us.</p>
          <p>Best Regards,<br> The RepairFind Team</p>

        </div>

        <div class="footer">
            <p style="color: #999999;">Best Regards, <br>  Repairfind Team<p>
        </div>
    </div>
</body>

</html>

`;