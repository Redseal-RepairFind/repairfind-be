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
