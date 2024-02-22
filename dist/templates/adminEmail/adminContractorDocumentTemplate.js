"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlContractorDocumentValidatinToAdminTemplate = void 0;
var htmlContractorDocumentValidatinToAdminTemplate = function (name) { return "\n<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Contractor Document Submission</title>\n\n    <style>\n        /* Font import */\n        @import url('https://fonts.googleapis.com/css2?family=Jost&display=swap');\n\n        /* Email body styles */\n        body {\n            font-family: 'Jost', sans-serif;\n            margin: 0;\n            padding: 0;\n            background-color: #f5f5f5;\n        }\n\n        /* Wrapper styles */\n        .email-wrapper {\n            width: 100%;\n            max-width: 600px;\n            margin: 0 auto;\n            background-color: #ffffff;\n        }\n\n        /* Header styles */\n        .header {\n            text-align: center;\n            padding: 20px;\n            background-color: #f5f5f5;\n        }\n\n        /* Content styles */\n        .content {\n            padding: 30px;\n        }\n\n        /* Footer styles */\n        .footer {\n            text-align: center;\n            padding: 20px;\n            background-color: #f5f5f5;\n        }\n    </style>\n</head>\n\n<body>\n    <div class=\"email-wrapper\">\n        <div class=\"header\">\n            <img src=\"https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png\" alt=\"Company Logo\">\n        </div>\n\n        <div class=\"content\">\n            <h2 style=\"color: #333333;\">Document Submission Notification</h2>\n            <p style=\"color: #666666;\">Hello Admin,</p>\n            <p style=\"color: #666666;\">The following contractor has submitted documents for validation:</p>\n            <p style=\"color: #666666;\"><strong>Contractor Name:</strong>".concat(name, "</p>\n            <p style=\"color: #666666;\">Please proceed with the validation process at your earliest convenience.</p>\n            <p style=\"color: #666666;\">Thank you!</p>\n        </div>\n\n        <div class=\"footer\">\n            <p style=\"color: #999999;\">Best Regards,</p>\n            <p style=\"color: #999999;\">Your Company Name</p>\n        </div>\n    </div>\n</body>\n\n</html>\n\n\n"); };
exports.htmlContractorDocumentValidatinToAdminTemplate = htmlContractorDocumentValidatinToAdminTemplate;
