
export const htmlJobRequestTemplate = (contractor: string, customer: string, date: string, description: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quotation Request Notification</title>
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
    .content {
      padding: 20px;
      background-color: #fff;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 200px;
      height: auto;
    }
  </style>
</head>
<body>

  <table class="container">
    <tr>
      <td class="header">
        <div class="logo">
          <img src="https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" alt="Company Logo">
        </div>
        <h1>Quotation Request Notification</h1>
      </td>
    </tr>
    <tr>
      <td class="content">
        <p>Dear ${contractor},</p>
        <p>You have received a quotation request from a customer, ${customer}, on RepairFind.</p>
        <p><strong>Date & Time of Request:</strong> ${date} </p>
        <p><strong>Job Description:</strong> ${description} </p>
        <p>Please note that you have 72 hours to respond to this quotation request. If no response is provided within this time frame, the job offer will be automatically declined.</p>
        <p>Take action promptly to secure the opportunity!</p>
        <p>If you have any questions or need further assistance, feel free to contact us.</p>
        <p>Best Regards,<br> The RepairFind Team</p>
      </td>
    </tr>
  </table>

</body>
</html>


`;