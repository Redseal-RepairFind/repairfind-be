
export const htmlJobQoutationTemplate = (customer: string, contractor: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quotation Received for Your Repair Project</title>
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
      <h2>Quotation Received for Your Repair Project</h2>
      <p>Dear ${customer},</p>
      <p>We're writing to inform you that a quotation for your repair project has been received from ${contractor}.</p>
      <p>The breakdown of the quote includes the GST and the total cost.</p>
      <p>You can access more detailed information about the quotation by logging in to the RepairFind platform.</p>
      <p>Please note that prompt feedback is appreciated. If we don't receive your response within the next 72 hours, the job will be closed.</p>
      <p>If you require further assistance or have any queries regarding the quotation or the RepairFind platform, please don't hesitate to contact us.</p>
      <p>Thank you for choosing RepairFind. We're looking forward to assisting you with your repair needs.</p>
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