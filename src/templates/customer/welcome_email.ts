export const CustomerWelcomeEmailTemplate = (name: string) => `
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
            <p>Hello ${name},</p>


          <p>Thank you for joining RepairFind. We're excited to have you with us!</p>
          <p>At RepairFind, we're committed to providing top-notch repair services and an amazing experience for our customers.</p>
          <p>Feel free to explore our services and let us know if you have any questions. We're here to help!</p>
          <p>Best Regards,<br> The RepairFind Team</p>

            

        </div>

        <div class="footer">
            <span style="color: #999999;">Best Regards,<span>
            <p style="color: #999999;">Repairfind Team</p>
        </div>
    </div>
</body>

</html>

`;