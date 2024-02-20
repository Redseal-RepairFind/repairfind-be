
export const htmlContractorWelcomeTemplate = (name: string,) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to RepairFind</title>
  <link href="https://fonts.googleapis.com/css2?family=Jost&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Jost', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      border-collapse: collapse;
      width: 100%;
    }
    .header {
      background-color: #f3f3f3;
      text-align: center;
      padding: 20px;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>

  <table class="container">
    <tr>
      <td class="header">
        <img class="logo" src="https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" alt="RepairFind Logo">
        <h1>Welcome to RepairFind!</h1>
        <p>Dear ${name},</p>
        <p>Welcome aboard RepairFind! We're thrilled to have you join our network of skilled contractors.</p>
        <p>Your registration marks the beginning of an exciting journey with us.</p>
        <p>Please note that as part of our commitment to providing a safe environment for all users, we partner with Certn, a background check service.</p>
        <p>Expect an email from Certn shortly, requesting some personal information to facilitate the background check process.</p>
        <p>Completing this process is crucial for the approval of your account on RepairFind, so please keep an eye on your inbox and respond promptly to Certn's email.</p>
        <p>If you have any questions or need assistance, feel free to contact us.</p>
        <p>Best Regards,<br> The RepairFind Team</p>
      </td>
    </tr>
  </table>

</body>
</html>

`;