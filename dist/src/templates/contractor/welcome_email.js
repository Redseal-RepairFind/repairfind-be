"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorWelcomeTemplate = void 0;
var ContractorWelcomeTemplate = function (name) { return "\n<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Email Verification</title>\n\n    <style>\n        /* Font import */\n        @import url('https://fonts.googleapis.com/css2?family=Jost&display=swap');\n\n        /* Email body styles */\n        body {\n            font-family: 'Jost', sans-serif;\n            margin: 0;\n            padding: 0;\n            background-color: #f5f5f5;\n        }\n\n        /* Wrapper styles */\n        .email-wrapper {\n            width: 100%;\n            max-width: 600px;\n            margin: 0 auto;\n            background-color: #ffffff;\n        }\n\n        /* Header styles */\n        .header {\n            text-align: center;\n            padding: 20px;\n            background-color: #f5f5f5;\n        }\n\n        /* Content styles */\n        .content {\n            padding: 30px;\n        }\n\n\n\n        /* Footer styles */\n        .footer {\n            text-align: center;\n            padding: 20px;\n            background-color: #f5f5f5;\n        }\n    </style>\n</head>\n\n<body>\n    <div class=\"email-wrapper\">\n        <div class=\"header\">\n            <img  src=\"https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png\" alt=\"Repairfind Logo\">\n        </div>\n\n        <div class=\"content\">\n            <h2 style=\"color: #333333;\">Welcome to RepairFind!</h2>\n            <p>Dear ".concat(name, ",</p>\n\n         \n          <p>Welcome aboard RepairFind! We're thrilled to have you join our network of skilled contractors.</p>\n          <p>Your registration marks the beginning of an exciting journey with us.</p>\n          <p>Please note that as part of our commitment to providing a safe environment for all users, we partner with Certn, a background check service.</p>\n          <p>Expect an email from Certn shortly, requesting some personal information to facilitate the background check process.</p>\n          <p>Completing this process is crucial for the approval of your account on RepairFind, so please keep an eye on your inbox and respond promptly to Certn's email.</p>\n          \n          <p>If you have any questions or need assistance, feel free to contact us.</p>\n          <p>Best Regards,<br> The RepairFind Team</p>\n\n        </div>\n\n        <div class=\"footer\">\n            <p style=\"color: #999999;\">Best Regards, <br>  Repairfind Team<p>\n        </div>\n    </div>\n</body>\n\n</html>\n\n"); };
exports.ContractorWelcomeTemplate = ContractorWelcomeTemplate;