"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlJobRequestTemplate = void 0;
var htmlJobRequestTemplate = function (contractor, customer, date, description) { return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Quotation Request Notification</title>\n  <link href=\"https://fonts.googleapis.com/css2?family=Jost&display=swap\" rel=\"stylesheet\">\n  <style>\n    body {\n      font-family: 'Jost', Arial, sans-serif;\n      margin: 0;\n      padding: 20px;\n      line-height: 1.6;\n    }\n    .container {\n      max-width: 600px;\n      margin: 0 auto;\n      border-collapse: collapse;\n      width: 100%;\n    }\n    .header {\n      background-color: #f3f3f3;\n      text-align: center;\n      padding: 20px;\n    }\n    .content {\n      padding: 20px;\n      background-color: #fff;\n    }\n    .logo {\n      text-align: center;\n      margin-bottom: 20px;\n    }\n    .logo img {\n      max-width: 200px;\n      height: auto;\n    }\n  </style>\n</head>\n<body>\n\n  <table class=\"container\">\n    <tr>\n      <td class=\"header\">\n        <div class=\"logo\">\n          <img src=\"https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png\" alt=\"Company Logo\">\n        </div>\n        <h1>Quotation Request Notification</h1>\n      </td>\n    </tr>\n    <tr>\n      <td class=\"content\">\n        <p>Dear ".concat(contractor, ",</p>\n        <p>You have received a quotation request from a customer, ").concat(customer, ", on RepairFind.</p>\n        <p><strong>Date & Time of Request:</strong> ").concat(date, " </p>\n        <p><strong>Job Description:</strong> ").concat(description, " </p>\n        <p>Please note that you have 72 hours to respond to this quotation request. If no response is provided within this time frame, the job offer will be automatically declined.</p>\n        <p>Take action promptly to secure the opportunity!</p>\n        <p>If you have any questions or need further assistance, feel free to contact us.</p>\n        <p>Best Regards,<br> The RepairFind Team</p>\n      </td>\n    </tr>\n  </table>\n\n</body>\n</html>\n\n\n"); };
exports.htmlJobRequestTemplate = htmlJobRequestTemplate;
