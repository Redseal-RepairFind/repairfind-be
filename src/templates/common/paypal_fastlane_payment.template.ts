export const PaypalFastLanePaymentCheckoutTemplate = ({ token, paypalClientId, quotationId, jobId, isChangeOrder = false, enableCardField = true }: { token: string, paypalClientId: string, quotationId: any, jobId: any, isChangeOrder: boolean, enableCardField?: boolean }) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css" />
  <title>PayPal FastLane Checkout</title>

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
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .disabled {
      pointer-events: none;
      opacity: 0.7;
    }

    #card-form {
      display: none;
    }
  </style>
</head>

<body>

<div id="wepay_checkout_container"></div>
<script type="text/javascript" src="https://www.wepay.com/min/js/iframe.wepay.js"></script>
<script type="text/javascript">
    WePay.iframe_checkout("wepay_checkout_container", "https://stage.wepay.com/api/checkout/12345");
</script>
</body>

</html>
`;
