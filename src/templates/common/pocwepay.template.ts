export const POCWEPAY = ({token, paypalClientId, enableCardField=false}: {token: string, paypalClientId: string, enableCardField?: boolean }) =>  `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css" />
        <title>PayPal JS SDK Advanced Integration - Checkout Flow</title>

        <style>
        /* Loader style */
        .loader {
          border: 4px solid #f3f3f3;
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          display: none;
          margin-left: 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .disabled {
          pointer-events: none;
          opacity: 0.7;
        }
        #card-form{
          display:none
        }
          .notice {
            font-size: 0.9rem;
            color: #555;
            margin-top: 10px;
          }
      </style>

        <script src="https://gatewayt.moneris.com/chktv2/js/chkt_v2.00.js">
        <div id="monerisCheckout"></div>
        
      </head>
      <body>

        <script>
            var myCheckout = new monerisCheckout();
            myCheckout.setMode("qa");
            myCheckout.setCheckoutDiv("monerisCheckout");

            var myCheckout = new monerisCheckout();
            myCheckout.setCallback("page_loaded", myPageLoad);
            myCheckout.setCallback("cancel_transaction", myCancelTransaction);
            myCheckout.setCallback("error_event", myErrorEvent);
            myCheckout.setCallback("payment_receipt", myPaymentReceipt);
            myCheckout.setCallback("payment_complete", myPaymentComplete);

        </script>
        
       
      </body>
    </html>
  `;
