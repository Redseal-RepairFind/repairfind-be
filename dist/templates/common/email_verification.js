"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationTemplate = void 0;
var EmailVerificationTemplate = function (otp, firstName) { return "\n<!DOCTYPE html>\n<html lang=\"en\"> \n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Email Verification</title>\n\n    <style>\n        /* Font import */\n        @import url('https://fonts.googleapis.com/css2?family=Jost&display=swap');\n\n        /* Email body styles */\n        body {\n            font-family: 'Jost', sans-serif;\n            margin: 0;\n            padding: 0;\n            background-color: #f5f5f5;\n        }\n\n        /* Wrapper styles */\n        .email-wrapper {\n            width: 100%;\n            max-width: 600px;\n            margin: 0 auto;\n            background-color: #ffffff;\n        }\n\n        /* Header styles */\n        .header {\n            text-align: center;\n            padding: 20px;\n            background-color: #f5f5f5;\n        }\n\n        /* Content styles */\n        .content {\n            padding: 30px;\n        }\n\n\n        .otp {\n          display: inline-block;\n          padding: 10px;\n          border-radius: 5px;\n          background-color: #ddd;\n          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);\n          backdrop-filter: blur(5px);\n          font-family: 'Inconsolata', monospace;\n          font-size: 24px;\n          font-weight: bold;\n          color: #333333;\n          cursor: pointer;\n        }\n\n\n        /* Footer styles */\n        .footer {\n            text-align: center;\n            padding: 20px;\n            background-color: #f5f5f5;\n        }\n    </style>\n</head>\n\n<body>\n    <div class=\"email-wrapper\">\n        <div class=\"header\">\n            <img  src=\"https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png\" alt=\"Repairfind Logo\">\n        </div>\n\n        <div class=\"content\">\n            <h2 style=\"color: #333333;\">Email  Verification</h2>\n            <p style=\"color: #666666;\">Hello ".concat(firstName, ",</p>\n            \n            <p style=\"color: #666666;\">We have received a request to verify your email.</p>\n            <p style=\"color: #666666;\">Please use the following OTP to verify your email:</p>\n            <p class=\"otp\" style=\"color: #666666;\">Otp: ").concat(otp, "</p>\n            <p style=\"color: #666666;\">Thank you for being a part of the Repairfind community!</p>\n        </div>\n\n        <div class=\"footer\">\n            <p style=\"color: #999999;\">Best Regards,</p>\n            <p style=\"color: #999999;\">Repairfind Team</p>\n        </div>\n    </div>\n</body>\n\n</html>\n\n"); };
exports.EmailVerificationTemplate = EmailVerificationTemplate;
