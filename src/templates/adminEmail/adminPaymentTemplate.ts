
export const htmlAdminPaymentTemplate = (jobId: string, customerId: any, amount: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation for a Project</title>
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
      <img src="https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" alt="Company Logo" width="200" height="100">
    </div>
    <div class="content">
      <h2>Payment Confirmation for a Project</h2>
      <p>Dear Administrator,</p>
      <p>This is to notify you that payment has been received for a project.</p>
      <p>The total amount received is: $${amount}</p>
      <p>Below are the project details that might be required:</p>
      <ul>
        <li>Job ID: ${jobId}</li>
        <li>Customer ID: ${customerId}</li>
        
      </ul>
      <p>Thank you for your attention to this matter.</p>
      <br>
      <p>Best Regards,<br> The RepairFind Team</p>
    </div>
    <div class="footer">
      <p>Follow us on [Social Media Links]</p>
    </div>
  </div>
</body>
</html>
`;