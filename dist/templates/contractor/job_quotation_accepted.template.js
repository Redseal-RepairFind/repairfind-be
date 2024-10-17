"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlJobQuotationAcceptedContractorEmailTemplate = void 0;
var htmlJobQuotationAcceptedContractorEmailTemplate = function (contractor, customer, job) { return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Job Quotation Accepted</title>\n  <link href=\"https://fonts.googleapis.com/css2?family=Jost&display=swap\" rel=\"stylesheet\">\n  <style>\n    body {\n      font-family: 'Jost', Arial, sans-serif;\n      margin: 0;\n      padding: 20px;\n      line-height: 1.6;\n    }\n    .container {\n      max-width: 600px;\n      margin: 0 auto;\n      border-collapse: collapse;\n      width: 100%;\n    }\n    .header {\n      background-color: #f3f3f3;\n      text-align: center;\n      padding: 20px;\n    }\n    .content {\n      padding: 20px;\n      background-color: #fff;\n    }\n    .logo {\n      text-align: center;\n      margin-bottom: 20px;\n    }\n    .logo img {\n      max-width: 200px;\n      height: auto;\n    }\n  </style>\n</head>\n<body>\n\n  <table class=\"container\">\n    <tr>\n      <td class=\"header\">\n        <div class=\"logo\">\n          <img src=\"https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png\" alt=\"Company Logo\">\n        </div>\n        <h1>Job Quotation Accepted</h1>\n      </td>\n    </tr>\n    <tr>\n      <td class=\"content\">\n        <p>Dear ".concat(contractor, ",</p>\n        <p>Your job  quotation to  a customer, ").concat(customer, ",  on RepairFind has been accepted.</p>\n        <p><strong>Date & Time of Job:</strong> ").concat(job.date, " </p>\n        <p><strong>Job Description:</strong> ").concat(job.description, " </p>\n        <p>Login to our app to follow up </p>\n        <p>If you have any questions or need further assistance, feel free to contact us.</p>\n        <p>Best Regards,<br> The RepairFind Team</p>\n      </td>\n    </tr>\n  </table>\n\n</body>\n</html>\n\n\n"); };
exports.htmlJobQuotationAcceptedContractorEmailTemplate = htmlJobQuotationAcceptedContractorEmailTemplate;
