import { IJobEmergency } from "../../database/common/job_emergency.model";
import { IJob } from "../../database/contractor/interface/job.interface";

export const JobEmergencyEmailTemplate = (payload: {name: string, emergency: IJobEmergency, job: any}) => `
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
        <h1> Job Emergency</h1>
      </td>
    </tr>
    <tr>
      <td class="content">
        <h2 style="color: #333333;text-transform:capitalize">Dear ${payload.name},</h2>
        <p style="color: #333333;">We have received your emergency report for an active job day on repairfind, please take neccessary precaution while we make contact with relevant authorities:</p>
        <p>If this report was unintentional, kindly mark it as resolved</p>
        <p style="color: #333333;">Thank you for choosing RepairFind and stay safe</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">RepairFind</p>
      </td>
    </tr>
  </table>

</body>
</html>


`;


