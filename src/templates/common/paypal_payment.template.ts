export const PaypalPaymentCheckoutTemplate = (payload: {token: string, paypalClientId: string, quotationId: any, jobId: any}) =>  `
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
      </style>


      </head>
      <body>
        <div id="paypal-button-container" class="paypal-button-container"></div>
        <div id="card-form" class="card_container">
          <div id="card-name-field-container"></div>
          <div id="card-number-field-container"></div>
          <div id="card-expiry-field-container"></div>
          <div id="card-cvv-field-container"></div>
          
          <br /><br />
          <button id="card-field-submit-button" type="button">Add Payment Method</button>
          <div id="loader" class="loader"></div>
        </div>
        <p id="result-message"></p>
        
        <script src="https://www.paypal.com/sdk/js?components=buttons,card-fields&client-id=${payload.paypalClientId}&currency=CAD"></script>
        <script>
          async function createOrderCallback() {
            try {
              const response = await fetch('/api/v1/customer/jobs/${payload.jobId}/paypal/create-checkout-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ${payload.token}'
                },
                body: JSON.stringify({ quotationId: ${payload.quotationId} }) 
              });
              const orderData = await response.json();
              console.log('orderData', orderData);
              return orderData.id;
            } catch (error) {
              console.error(error);
              alert(\`Could not initiate PayPal Checkout...\`);
            }
          }

          async function onApproveCallback(data, actions) {
            try {
              const response = await fetch('/api/v1/customer/paypal/authorize-payment-method-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ${payload.token}'
                },
                body: JSON.stringify({ orderID: data.orderID }) 
              });

              const res = await response.json();
              if (res.success) {
                window.location.href = 'https://repairfind.ca/payment-success/';
              }else{
                alert("Sorry, your payment method could not be added...");
                window.history.back();
              }
            } catch (error) {
              console.error(error);
              alert("Sorry, your payment method could not be added...");
              window.history.back();
            }
          }

          window.paypal
            .Buttons({
              createOrder: createOrderCallback,
              onApprove: onApproveCallback,
            })
            .render('#paypal-button-container');

          const cardField = window.paypal.CardFields({
            createOrder: createOrderCallback,
            onApprove: onApproveCallback,
          });

          if (cardField.isEligible()) {
            const nameField = cardField.NameField();
            nameField.render('#card-name-field-container');
            
            const numberField = cardField.NumberField();
            numberField.render('#card-number-field-container');
            
            const cvvField = cardField.CVVField();
            cvvField.render('#card-cvv-field-container');
            
            const expiryField = cardField.ExpiryField();
            expiryField.render('#card-expiry-field-container');
            
            document.getElementById('card-field-submit-button').addEventListener('click', () => {

              const submitButton = document.getElementById('card-field-submit-button');
              const loader = document.getElementById('loader');
              submitButton.classList.add('disabled');
              loader.style.display = 'inline-block';


              cardField
                .submit({
                 
                })
                .catch((error) => {
                  loader.style.display = 'none';
                  submitButton.classList.remove('disabled');
                  alert(\`Sorry, your payment method could not be added...\`);
                });
            });
          } else {
            document.querySelector('#card-form').style = 'display: none';
          }

          function resultMessage(message) {
            const container = document.querySelector('#result-message');
            container.innerHTML = message;
          }
        </script>
      </body>
    </html>
  `;
