"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalCheckoutTemplate = void 0;
var PaypalCheckoutTemplate = function (payload) { return "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <link rel=\"stylesheet\" type=\"text/css\" href=\"https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css\" />\n        <title>PayPal JS SDK Advanced Integration - Checkout Flow</title>\n\n        <style>\n        /* Loader style */\n        .loader {\n          border: 4px solid #f3f3f3;\n          border-radius: 50%;\n          border-top: 4px solid #3498db;\n          width: 30px;\n          height: 30px;\n          animation: spin 1s linear infinite;\n          display: none;\n          margin-left: 10px;\n        }\n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n        .disabled {\n          pointer-events: none;\n          opacity: 0.7;\n        }\n      </style>\n\n\n      </head>\n      <body>\n        <div id=\"paypal-button-container\" class=\"paypal-button-container\"></div>\n        <div id=\"card-form\" class=\"card_container\">\n          <div id=\"card-name-field-container\"></div>\n          <div id=\"card-number-field-container\"></div>\n          <div id=\"card-expiry-field-container\"></div>\n          <div id=\"card-cvv-field-container\"></div>\n          \n          <br /><br />\n          <button id=\"card-field-submit-button\" type=\"button\">Add Payment Method</button>\n          <div id=\"loader\" class=\"loader\"></div>\n        </div>\n        <p id=\"result-message\"></p>\n        \n        <script src=\"https://www.paypal.com/sdk/js?components=buttons,card-fields&client-id=".concat(payload.paypalClientId, "\"></script>\n        <script>\n          async function createOrderCallback() {\n            try {\n              const response = await fetch('/api/v1/customer/paypal/create-payment-method-order', {\n                method: 'POST',\n                headers: {\n                  'Content-Type': 'application/json',\n                  'Authorization': 'Bearer ").concat(payload.token, "'\n                }\n              });\n              const orderData = await response.json();\n              console.log('orderData', orderData);\n              return orderData.id;\n            } catch (error) {\n              console.error(error);\n              alert(`Could not initiate PayPal Checkout...`);\n            }\n          }\n\n          async function onApproveCallback(data, actions) {\n            try {\n              const response = await fetch('/api/v1/customer/paypal/authorize-payment-method-order', {\n                method: 'POST',\n                headers: {\n                  'Content-Type': 'application/json',\n                  'Authorization': 'Bearer ").concat(payload.token, "'\n                },\n                body: JSON.stringify({ orderID: data.orderID }) \n              });\n\n              const res = await response.json();\n              if (res.success) {\n                window.location.href = 'https://repairfind.ca/payment-success/';\n              }else{\n                alert(\"Sorry, your payment method could not be added...\");\n                window.history.back();\n              }\n            } catch (error) {\n              console.error(error);\n              alert(\"Sorry, your payment method could not be added...\");\n              window.history.back();\n            }\n          }\n\n          window.paypal\n            .Buttons({\n              createOrder: createOrderCallback,\n              onApprove: onApproveCallback,\n            })\n            .render('#paypal-button-container');\n\n          const cardField = window.paypal.CardFields({\n            createOrder: createOrderCallback,\n            onApprove: onApproveCallback,\n          });\n\n          if (cardField.isEligible()) {\n            const nameField = cardField.NameField();\n            nameField.render('#card-name-field-container');\n            \n            const numberField = cardField.NumberField();\n            numberField.render('#card-number-field-container');\n            \n            const cvvField = cardField.CVVField();\n            cvvField.render('#card-cvv-field-container');\n            \n            const expiryField = cardField.ExpiryField();\n            expiryField.render('#card-expiry-field-container');\n            \n            document.getElementById('card-field-submit-button').addEventListener('click', () => {\n\n              const submitButton = document.getElementById('card-field-submit-button');\n              const loader = document.getElementById('loader');\n              submitButton.classList.add('disabled');\n              loader.style.display = 'inline-block';\n\n\n              cardField\n                .submit({\n                 \n                })\n                .catch((error) => {\n                  loader.style.display = 'none';\n                  submitButton.classList.remove('disabled');\n                  alert(`Sorry, your payment method could not be added...`);\n                });\n            });\n          } else {\n            document.querySelector('#card-form').style = 'display: none';\n          }\n\n          function resultMessage(message) {\n            const container = document.querySelector('#result-message');\n            container.innerHTML = message;\n          }\n        </script>\n      </body>\n    </html>\n  "); };
exports.PaypalCheckoutTemplate = PaypalCheckoutTemplate;
// <div>
//           <label for="card-billing-address-line-1">Billing Address</label>
//           <input type="text" id="card-billing-address-line-1" name="card-billing-address-line-1" autocomplete="off" placeholder="Address line 1" />
//         </div>
//         <div>
//           <input type="text" id="card-billing-address-line-2" name="card-billing-address-line-2" autocomplete="off" placeholder="Address line 2" />
//         </div>
//         <div>
//           <input type="text" id="card-billing-address-admin-area-line-1" name="card-billing-address-admin-area-line-1" autocomplete="off" placeholder="Admin area line 1" />
//         </div>
//         <div>
//           <input type="text" id="card-billing-address-admin-area-line-2" name="card-billing-address-admin-area-line-2" autocomplete="off" placeholder="Admin area line 2" />
//         </div>
//         <div>
//           <input type="text" id="card-billing-address-country-code" name="card-billing-address-country-code" autocomplete="off" placeholder="Country code" />
//         </div>
//         <div>
//           <input type="text" id="card-billing-address-postal-code" name="card-billing-address-postal-code" autocomplete="off" placeholder="Postal/zip code" />
//         </div>
// billingAddress: {
//   addressLine1: document.getElementById('card-billing-address-line-1').value,
//   addressLine2: document.getElementById('card-billing-address-line-2').value,
//   adminArea1: document.getElementById('card-billing-address-admin-area-line-1').value,
//   adminArea2: document.getElementById('card-billing-address-admin-area-line-2').value,
//   countryCode: document.getElementById('card-billing-address-country-code').value,
//   postalCode: document.getElementById('card-billing-address-postal-code').value,
// },
