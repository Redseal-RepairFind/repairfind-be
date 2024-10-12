"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalPaymentCheckoutTemplate = void 0;
var PaypalPaymentCheckoutTemplate = function (payload) { return "\n<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <link rel=\"stylesheet\" type=\"text/css\"\n    href=\"https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css\" />\n  <title>PayPal JS SDK Advanced Integration - Checkout Flow</title>\n\n  <style>\n    /* Loader style */\n    .loader {\n      border: 4px solid #f3f3f3;\n      border-radius: 50%;\n      border-top: 4px solid #3498db;\n      width: 30px;\n      height: 30px;\n      animation: spin 1s linear infinite;\n      display: none;\n      margin-left: 10px;\n    }\n\n    @keyframes spin {\n      0% {\n        transform: rotate(0deg);\n      }\n\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n\n    .disabled {\n      pointer-events: none;\n      opacity: 0.7;\n    }\n  </style>\n\n\n</head>\n\n<body>\n  <div id=\"paypal-button-container\" class=\"paypal-button-container\"></div>\n  <div id=\"card-form\" class=\"card_container\">\n    <div id=\"card-name-field-container\"></div>\n    <div id=\"card-number-field-container\"></div>\n    <div id=\"card-expiry-field-container\"></div>\n    <div id=\"card-cvv-field-container\"></div>\n\n    <br /><br />\n    <button id=\"card-field-submit-button\" type=\"button\">Make Payment</button>\n    <div id=\"loader\" class=\"loader\"></div>\n  </div>\n  <p id=\"result-message\"></p>\n\n  <script\n    src=\"https://www.paypal.com/sdk/js?components=buttons,card-fields&client-id=".concat(payload.paypalClientId, "&currency=CAD\"></script>\n  <script>\n    async function createOrderCallback() {\n      try {\n        const response = await fetch('/api/v1/customer/jobs/").concat(payload.jobId, "/paypal/create-checkout-order', {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json',\n            'Authorization': 'Bearer ").concat(payload.token, "'\n          },\n          body: JSON.stringify({ quotationId: '").concat(payload.quotationId, "', isChangeOrder: '").concat(payload.isChangeOrder, "' })\n        });\n        const orderData = await response.json();\n        console.log('orderData', orderData);\n        return orderData.data.capture.id;\n      } catch (error) {\n        console.error(error);\n        alert(`Could not initiate PayPal Checkout...`);\n            }\n          }\n\n          async function onApproveCallback(data, actions) {\n            try {\n              const response = await fetch('/api/v1/customer/jobs/").concat(payload.jobId, "/paypal/capture-checkout-order', {\n                method: 'POST',\n                headers: {\n                  'Content-Type': 'application/json',\n                  'Authorization': 'Bearer ").concat(payload.token, "'\n                },\n                body: JSON.stringify({ orderId: data.orderID, quotationId:'").concat(payload.quotationId, "' }) \n              });\n\n              const res = await response.json();\n              if (res.success) {\n                window.location.href = 'https://repairfind.ca/payment-success/';\n              }else{\n                alert(\"Sorry, your payment was not successful...\");\n              }\n            } catch (error) {\n              console.error(error);\n              alert(\"Sorry, your payment  was not successful...\");\n            }\n          }\n\n          window.paypal\n            .Buttons({\n              createOrder: createOrderCallback,\n              onApprove: onApproveCallback,\n              onError: function(err) {\n                  console.error('Error:', err);\n              }\n            })\n            .render('#paypal-button-container');\n\n          const cardField = window.paypal.CardFields({\n            createOrder: createOrderCallback,\n            onApprove: onApproveCallback,\n          });\n\n          if (cardField.isEligible()) {\n            const nameField = cardField.NameField();\n            nameField.render('#card-name-field-container');\n            \n            const numberField = cardField.NumberField();\n            numberField.render('#card-number-field-container');\n            \n            const cvvField = cardField.CVVField();\n            cvvField.render('#card-cvv-field-container');\n            \n            const expiryField = cardField.ExpiryField();\n            expiryField.render('#card-expiry-field-container');\n            \n            document.getElementById('card-field-submit-button').addEventListener('click', () => {\n\n              const submitButton = document.getElementById('card-field-submit-button');\n              const loader = document.getElementById('loader');\n              submitButton.classList.add('disabled');\n              loader.style.display = 'inline-block';\n\n                cardField\n                .submit({\n                  createOrder: createOrderCallback,\n                  onApprove: onApproveCallback,\n                })\n                .then(() => {\n                  loader.style.display = 'none';\n                  submitButton.classList.remove('disabled');\n                })\n                .catch((error) => {\n                  loader.style.display = 'none';\n                  submitButton.classList.remove('disabled');\n                  console.log(error)\n                  alert('Processing of this card type is not supported. Use another type of card.');\n                });\n\n\n            });\n          } else {\n            document.querySelector('#card-form').style = 'display: none';\n          }\n\n          function resultMessage(message) {\n            const container = document.querySelector('#result-message');\n            container.innerHTML = message;\n          }\n  </script>\n</body>\n\n</html>\n"); };
exports.PaypalPaymentCheckoutTemplate = PaypalPaymentCheckoutTemplate;
