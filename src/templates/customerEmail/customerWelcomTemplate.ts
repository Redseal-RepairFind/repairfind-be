
export const htmlcustomerWelcomTemplate = (name: string) => `
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
        <p>Thank you for joining RepairFind. We're excited to have you with us!</p>
        <p>At RepairFind, we're committed to providing top-notch repair services and an amazing experience for our customers.</p>
        <p>Feel free to explore our services and let us know if you have any questions. We're here to help!</p>
        <p>Best Regards,<br> The RepairFind Team</p>
      </td>
    </tr>
  </table>

</body>
</html>

`;