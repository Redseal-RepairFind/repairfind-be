"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlAdminPaymentTemplate = void 0;
var htmlAdminPaymentTemplate = function (jobId, customerId, amount) { return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Payment Confirmation for a Project</title>\n  <style>\n    /* Font import */\n    @import url('https://fonts.googleapis.com/css2?family=Jost&display=swap');\n\n    /* Email body styles */\n    body {\n      font-family: 'Jost', sans-serif;\n      margin: 0;\n      padding: 0;\n      background-color: #f5f5f5;\n    }\n\n    /* Wrapper styles */\n    .email-wrapper {\n      width: 100%;\n      max-width: 600px;\n      margin: 0 auto;\n      background-color: #ffffff;\n    }\n\n    /* Header styles */\n    .header {\n      text-align: center;\n      padding: 20px;\n      background-color: #f5f5f5;\n    }\n\n    /* Content styles */\n    .content {\n      padding: 30px;\n    }\n\n    /* Footer styles */\n    .footer {\n      text-align: center;\n      padding: 20px;\n      background-color: #f5f5f5;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"email-wrapper\">\n    <div class=\"header\">\n      <img src=\"https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png\" alt=\"Company Logo\" width=\"200\" height=\"100\">\n    </div>\n    <div class=\"content\">\n      <h2>Payment Confirmation for a Project</h2>\n      <p>Dear Administrator,</p>\n      <p>This is to notify you that payment has been received for a project.</p>\n      <p>The total amount received is: $".concat(amount, "</p>\n      <p>Below are the project details that might be required:</p>\n      <ul>\n        <li>Job ID: ").concat(jobId, "</li>\n        <li>Customer ID: ").concat(customerId, "</li>\n        \n      </ul>\n      <p>Thank you for your attention to this matter.</p>\n      <br>\n      <p>Best Regards,<br> The RepairFind Team</p>\n    </div>\n    <div class=\"footer\">\n      <p>Follow us on [Social Media Links]</p>\n    </div>\n  </div>\n</body>\n</html>\n"); };
exports.htmlAdminPaymentTemplate = htmlAdminPaymentTemplate;
