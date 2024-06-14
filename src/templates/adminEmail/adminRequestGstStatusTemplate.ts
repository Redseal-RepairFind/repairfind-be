
export const htmlAdminRquestGstStatuChangeTemplate = (adminName: string, contractorName: string, contaractorEmail: string, otp: string, status: string) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contractor Document Submission</title>

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
            <img src="https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" alt="Company Logo">
        </div>

        <div class="content">
            <h2 style="color: #333333;">GST Status Change Request</h2>
            <p style="color: #666666;">Hello Admin,</p>
            <p style="color: #666666;">The following admin has requsted for contractor status change:</p>
            <p style="color: #666666;"><strong>Admin Name:</strong>${adminName}</p>
            <p style="color: #666666;"><strong>Contractor Name:</strong>${contractorName}</p>
            <p style="color: #666666;"><strong>contractor Email:</strong>${contaractorEmail}</p>
            <p style="color: #666666;"><strong>GST Status Requsted:</strong>${status}</p>
            <p style="color: #666666;"><strong>OTP:</strong>${otp}</p>
            <p style="color: #666666;">Please proceed with the validation process at your earliest convenience.</p>
            <p style="color: #666666;">Thank you!</p>
        </div>

        <div class="footer">
            <p style="color: #999999;">Best Regards,</p>
            <p style="color: #999999;">Your Company Name</p>
        </div>
    </div>
</body>

</html>


`;