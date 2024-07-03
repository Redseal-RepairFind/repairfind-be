import { IJob } from "../../database/common/job.model";
import { IContractor } from "../../database/contractor/interface/contractor.interface";

export const NewJobAssignedEmailTemplate = (contractor: IContractor, employee: IContractor, job: IJob) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Quotation Accepted</title>
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
        <h1>New Job Assigned</h1>
      </td>
    </tr>
    <tr>
      <td class="content">
        <p>Dear ${employee.name},</p>
        <p>You  have  been assigned a new job on RepairFind by ${contractor.name}.</p>
        <p><strong>Date & Time of Job:</strong> ${job.date} </p>
        <p><strong>Job Description:</strong> ${job.description} </p>
        <p>Login to our app to follow up </p>
        <p>If you have any questions or need further assistance, feel free to contact us.</p>
        <p>Best Regards,<br> The RepairFind Team</p>
      </td>
    </tr>
  </table>

</body>
</html>


`;