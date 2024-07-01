# REPAIRFIND BACKEND


``` json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/index.ts",
    "js-dev": "nodemon dist/index.ts",
    "build": "rm -rf ./dist && tsc && npm run copy-files",
    "copy-files": "npx copyfiles .env dist/ package.json dist/ package-lock.json dist/ ecosystem.config.js dist/ command.js dist/",
    "start": "node dist/index.js",
    "build-start": "node dist/index.js"
  },
  ```

  ```json
`  "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "nodemon src/index.ts",
        "js-dev": "nodemon dist/index.ts",
        "build": "rm -rf ./dist && tsc && npm run copy-files",
        "copy-files": "npx copyfiles .env dist/ package.json dist/ package-lock.json dist/ ecosystem.config.js dist/ command.js dist/",
        "start": "node dist/index.js",
        "build-start": "npm run build && npm start", // Builds and starts the application in production mode
        "deploy": "npm run build-start" // Script for deploying to DigitalOcean
    }
```



```js

        //PAYMENT INTEGRATION NOTED

        //  Direct CHARGES
        // With Connect, you can make charges directly to the connected account and take fees in the process.
        // To create a direct charge on the connected account, create a PaymentIntent object and add the Stripe-Account header with a value of the connected account ID:

        //  https://docs.stripe.com/connect/charges
        // When using Standard accounts, Stripe recommends that you create direct charges. Though uncommon, there are times when it’s appropriate to use direct charges on Express or Custom accounts.
        // With this charge type:
        // You create a charge on your user’s account so the payment appears as a charge on the connected account, not in your account balance.
        // The connected account’s balance increases with every charge.
        // Funds always settle in the country of the connected account.
        // Your account balance increases with application fees from every charge.
        // The connected account’s balance is debited for refunds and chargebacks.
        //direct charge requires the customer has to exists on the connected account platform -- consider cloning https://docs.stripe.com/connect/cloning-customers-across-accounts
        // we can still take fees back to the platform by specifying application_fee_amount: 123,

        // DESTINATION CHARGES
        // Customers transact with your platform for products or services provided by your connected account.
        // The transaction involves a single user.
        // Stripe fees are debited from your platform account.

        //flow 1
        // here everything is transfered to connected account and then application_fee_amount is wired back to platform
        // application_fee_amount: 123,
        // transfer_data: {
        //     destination: '{{CONNECTED_ACCOUNT_ID}}',
        // },

        //flow 2
        // here only amount specified in transfer_data is transfered to connected account
        // transfer_data: {
        //     amount: 877,
        //     destination: '{{CONNECTED_ACCOUNT_ID}}',
        //   },

        // When you use on_behalf_of:
        // Charges are settled in the connected account’s country and settlement currency.
        // The connected account’s statement descriptor is displayed on the customer’s credit card statement.
        // If the connected account is in a different country than the platform, the connected account’s address and phone number are displayed on the customer’s credit card statement.
        // The number of days that a pending balance is held before being paid out depends on the delay_days setting on the connected account.


```


I'd be glad to create a comprehensive README listing the routes for your project, incorporating the best aspects of the provided responses and addressing any shortcomings:

**README: Admin Panel Routes**

This document provides a detailed explanation of the routes available in the admin panel of your application. Understanding these routes is essential for anyone working on the project, especially those interacting with the backend logic.

**Authentication**

* **POST /signup:** Registers a new admin user. Requires validation (`validateSignupParams`) before processing by the `adminSignUpController`.
* **POST /email/verification:** Verifies an admin user's email address. Requires validation (`validatAdminEmailverificationParams`) before processing by the `adminVerifiedEmailController`.
* **POST /resend/email:** Resends a verification email to an admin user. Requires validation (`validateAdminForgotPasswordParams`) before processing by the `adminResendEmailController`.
* **POST /signin:** Logs in an admin user. Requires validation (`validateAdminLoginParams`) before processing by the `AdminSignInController`.
* **POST /forgot/password:** Initiates the password reset process for an admin user. Requires validation (`validateAdminForgotPasswordParams`) before processing by the `AdminEmailForgotPasswordController`.
* **POST /reset/password:** Completes the password reset process for an admin user. Requires validation (`validateAdminResetPasswprdParams`) before processing by the `AdminEmailResetPasswordController`.

**Staff Management (Requires Admin Role)**

* **POST /staff:** Creates a new staff member. Requires validation (`Validations.AddStaffParams`) and admin role check (`checkAdminRole`) before processing by the `AddStaffController`.
* **POST /staff/status:** Changes the status of an existing staff member. Requires validation (`validateSuperAdmiCchangeStatusParams`), admin role check (`checkAdminRole`), and super admin role check for authorization. Processed by the `SuperAdminChangeStaffStatusController`.
* **GET /staffs:** Retrieves a list of all staff members. Requires admin role check (`checkAdminRole`) before processing by the `SuperAdminGetAllAdminController`.
* **POST /staff/permission:** Assigns a permission to a staff member. Requires validation (`Validations.AddPermissionParams`) and admin role check (`checkAdminRole`) before processing by the `SuperAdminAddPermissionToStaffController`.
* **POST /staff/permission/remove:** Removes a permission from a staff member. Requires validation (`Validations.AddPermissionParams`) and admin role check (`checkAdminRole`) before processing by the `SuperAdminRemovePermissionFromStaffController`.

**Permissions (Requires Admin Role)**

* **POST /permission:** Creates a new permission. Requires validation (`Validations.PermissionCreationParam`) and admin role check (`checkAdminRole`) before processing by the `Permission.PermissionCreationController`.
* **GET /permission:** Retrieves a list of all permissions. Requires admin role check (`checkAdminRole`) before processing by the `Permission.GetPermissionController`.
* **POST /edit/permission:** Edits an existing permission. Requires validation (`Validations.EditPermissionParams`) and admin role check (`checkAdminRole`) before processing by the `Permission.EditPermissionController`.

**Contractor Management (Requires Admin Role) - Continued**

* **GET /contractor/job/detail/:contractorId:** Retrieves details of a specific contractor's job by contractor ID. Requires admin role check (`checkAdminRole`) before processing by the `AdminContractorDetail.AdminGetSingleContractorJonDetailController`.
* **POST /contractor/account/status:** Changes the account status of a contractor. Requires validation (`Validations.ContractorChangeStatusParams`) and admin role check (`checkAdminRole`) before processing by the `AdminContractorDetail.AdminChangeContractorAccountStatusController`.

**Customer Management (Requires Admin Role)**

* **GET /customer/detail:** Retrieves details of all customers. Requires admin role check (`checkAdminRole`) before processing by the `AdminCustomerController.AdminGetCustomerDetailController`.
* **GET /customer/detail/:customerId:** Retrieves details of a specific customer by ID. Requires admin role check (`checkAdminRole`) before processing by the `AdminCustomerController.AdminGetSingleCustomerDetailController`.
* **GET /customer/job/detail/:customerId:** Retrieves details of a specific customer's job by customer ID. Requires admin role check (`checkAdminRole`) before processing by the `AdminCustomerController.AdminGetSingleCustomerJobDetailController`.

**Skills Management (Requires Admin Role)**

* **POST /skills:** Adds a new skill. Requires validation (`validateAddSkillParams`) and admin role check (`checkAdminRole`) before processing by the `AdminAddNewSkillController`. (Duplicate entries removed)
* **GET /skills:** Retrieves a list of all skills. Requires admin role check (`checkAdminRole`) before processing by the `AdminGetSkillController`.

**Job Management (Requires Admin Role)**

* **GET /jobs/detail:** Retrieves details of all jobs. Requires admin role check (`checkAdminRole`) before processing by the `AdminJobController.AdminGetJobsrDetailController`.
* **GET /jobs/detail/:jobId:** Retrieves details of a specific job by ID. Requires admin role check (`checkAdminRole`) before processing by the `AdminJobController.AdminGetSingleJobsrDetailController`.
* **GET /total_job:** Retrieves the total number of jobs. Requires admin role check (`checkAdminRole`) before processing by the `AdminJobController.AdminGetTotalJobsrController`.
* **GET /app_detail:** Retrieves details of the application. Requires admin role check (`checkAdminRole`) before processing by the `AdminGetAppDetailController`.
* **GET /invoice/detail/:jobId:** Retrieves the invoice details for a specific job. Requires admin role check (`checkAdminRole`) before processing by the `AdminJobController.AdminGetInvoiceSingleJobsrDetailController`.

**Transaction Management (Requires Admin Role)**

* **GET /transactions:** Retrieves a list of all transactions. Requires admin role check (`checkAdminRole`) before processing by the `TransactionDetailController.AdminGetTransactionDetailController`.
* **GET /transaction/:transactionId:** Retrieves details of a specific transaction by ID. Requires admin role check (`checkAdminRole`) before processing by the `TransactionDetailController.AdminGetSingleTransactionDetailController`.

**Emergency Management (Requires Admin Role)**

* **GET /emergecy/active:** Retrieves a list of active emergency jobs. Requires admin role check (`checkAdminRole`) before processing by the `ermergency.AdminGetActiveEmergencyJobController`.
* **GET /emergecy/new:** Retrieves a list of new emergency jobs. Requires admin role check (`checkAdminRole`) before processing by the `ermergency.AdminGeNewEmergencyJobController`.
* **GET /emergecy/resolve:** Retrieves a list of resolved emergency jobs. Requires admin role check (`checkAdminRole`) before processing by the `ermergency.AdminGetResolveEmergencyJobController`.
* **GET /emergecy/:emergencyId:** Retrieves details of a specific emergency job by ID. Requires admin role check (`checkAdminRole`) before processing by the `ermergency.AdminGetSingleEmergencyJobController`.
* **

** Dispute Resolution (Requires Admin Role) **
* **GET /dispute/active:** Retrieves a list of active emergency jobs. Requires admin role check (`checkAdminRole`) before processing by the `ermergency.AdminGetActiveEmergencyJobController`.
* **GET /dispute/new:** Retrieves a list of new emergency jobs. Requires admin role check (`checkAdminRole`) before processing by the `ermergency.AdminGeNewEmergencyJobController`.
* **GET /dispute/resolve:** Retrieves a list of resolved emergency jobs. Requires admin role check (`checkAdminRole`) before processing by the `ermergency.AdminGetResolveEmergencyJobController`.