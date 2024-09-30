export const OtpEmailTemplate = (otp: string, firstName: string, type: string) => `
<html>

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


    .otp {
      display: inline-block;
      padding: 10px;
      border-radius: 5px;
      background-color: #ddd;
      box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(5px);
      font-family: 'Inconsolata', monospace;
      font-size: 24px;
      font-weight: bold;
      color: #333333;
      cursor: pointer;
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
        <img src="https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" alt="Repairfind Logo">
      </div>

      <div class="content">
        <h2 style="color: #333333;">Email  Verification</h2>
        <p style="color: #666666;">Hello ${firstName},</p> 
        <p style="color: #666666;">${type}</p>
        <p style="color: #666666;">Please use the following OTP to verify:</p>
        <p class="otp" style="color: #666666;">Otp: ${otp}</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p style="color: #666666;">Thank you for being a part of the Repairfind community!</p>
      </div>
      
      <div class="footer">
        <p style="color: #999999;">Best Regards,</p>
        <p style="color: #999999;">Repairfind Team</p>
      </div>


  </div>

</body>

</html>
`;