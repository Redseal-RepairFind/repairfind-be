"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POCWEPAY = void 0;
var POCWEPAY = function (_a) {
    var token = _a.token, paypalClientId = _a.paypalClientId, _b = _a.enableCardField, enableCardField = _b === void 0 ? false : _b;
    return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<title>Fastlane - PayPal Integration - Quick Start</title>\n\n<head>\n  <link rel=\"stylesheet\" href=\"styles.css\" />\n</head>\n\n<body>\n  <form>\n    <h1>Fastlane - PayPal Integration - Quick Start</h1>\n\n    <section id=\"customer\" class=\"active visited\">\n      <div class=\"header\">\n        <h2>Customer</h2>\n        <button id=\"email-edit-button\" type=\"button\" class=\"edit-button\">\n          Edit\n        </button>\n      </div>\n      <div class=\"summary\"></div>\n      <div class=\"email-container\">\n        <fieldset class=\"email-input-with-watermark\">\n          <input id=\"email-input\" name=\"email\" type=\"email\" placeholder=\"Email\" autocomplete=\"email\" />\n          <div id=\"watermark-container\"></div>\n        </fieldset>\n        <button id=\"email-submit-button\" type=\"button\" class=\"submit-button\" disabled>\n          Continue\n        </button>\n      </div>\n    </section>\n\n    <hr />\n\n\n    <section id=\"shipping\">\n      <div class=\"header\">\n        <h2>Shipping</h2>\n        <button id=\"shipping-edit-button\" type=\"button\" class=\"edit-button\">\n          Edit\n        </button>\n      </div>\n      <div class=\"summary\"></div>\n      <fieldset>\n        <span>\n          <input id=\"shipping-required-checkbox\" name=\"shipping-required\" type=\"checkbox\" checked />\n          <label for=\"shipping-required-checkbox\">This purchase requires shipping</label>\n        </span>\n        <input name=\"given-name\" placeholder=\"First name\" autocomplete=\"given-name\" />\n        <input name=\"family-name\" placeholder=\"Last name\" autocomplete=\"family-name\" />\n        <input name=\"address-line1\" placeholder=\"Street address\" autocomplete=\"address-line1\" />\n        <input name=\"address-line2\" placeholder=\"Apt., ste., bldg. (optional)\" autocomplete=\"address-line2\" />\n        <input name=\"address-level2\" placeholder=\"City\" autocomplete=\"address-level2\" />\n        <input name=\"address-level1\" placeholder=\"State\" autocomplete=\"address-level1\" />\n        <input name=\"postal-code\" placeholder=\"ZIP code\" autocomplete=\"postal-code\" />\n        <input name=\"country\" placeholder=\"Country\" autocomplete=\"country\" />\n        <input name=\"tel-country-code\" placeholder=\"Country calling code\" autocomplete=\"tel-country-code\" />\n        <input name=\"tel-national\" type=\"tel\" placeholder=\"Phone number\" autocomplete=\"tel-national\" />\n      </fieldset>\n      <button id=\"shipping-submit-button\" type=\"button\" class=\"submit-button\">\n        Continue\n      </button>\n    </section>\n\n    <hr />\n\n    <section id=\"payment\">\n      <div class=\"header\">\n        <h2>Payment</h2>\n        <button id=\"payment-edit-button\" type=\"button\" class=\"edit-button\">\n          Edit\n        </button>\n      </div>\n      <fieldset>\n        <div id=\"payment-component\"></div>\n      </fieldset>\n    </section>\n\n    <button id=\"checkout-button\" type=\"button\" class=\"submit-button\">\n      Checkout\n    </button>\n  </form>\n\n\n  <script\n    src=\"https://www.paypal.com/sdk/js?client-id=AYcL710NkfmeLv4MvDn_41alzWrdzUk2y3RtgixQVxKYExfcm7nADdnH9jikjJqaRXCCyUziUEZW0FrB&components=buttons%2Cfastlane\"\n    data-sdk-client-token=\"eyJraWQiOiJkMTA2ZTUwNjkzOWYxMWVlYjlkMTAyNDJhYzEyMDAwMiIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJpc3MiOiJodHRwczovL2FwaS5zYW5kYm94LnBheXBhbC5jb20iLCJhdWQiOlsiaHR0cHM6Ly9hcGkuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJwYXlwYWwuY29tIl0sInN1YiI6Iko4UEdZNjM5Tk5SQ0wiLCJhY3IiOlsiY2xpZW50Il0sInNjb3BlIjpbIkJyYWludHJlZTpWYXVsdCJdLCJvcHRpb25zIjp7fSwiYXoiOiJjY2cxOC5zbGMiLCJleHRlcm5hbF9pZCI6WyJQYXlQYWw6SjhQR1k2MzlOTlJDTCIsIkJyYWludHJlZTo2ajdtamgycGhycGQ0aDJmIl0sImV4cCI6MTcyOTA2NzkxMCwiaWF0IjoxNzI5MDY3MDEwLCJqdGkiOiJVMkFBS3JwRHFIaWtXLUtjTjNIWk1RWWhndDQtMHJVYWRFa184Um5lX19mYkU4aHdyNkNaNjctd2pUMlJmaUNxWUJ6cDFFV1U2QzZJVndURlBLWUU2em5MZk40X20xRGJmSk45bUNaUlBxUUdwN1lLTkpHM09lR2tybVRCZXJwdyJ9.GMTDxg0C7lhpsla3_GdWHj9ZOY7D23a-Hkvs3gumJRc4azA2OsZxpayaBTtXJqYgVeG730udwglmlkXsa-q_yQ\"\n    data-sdk-integration-source=\"developer-studio\" defer></script>\n\n  <script defer>\n\n    async function initFastlane() {\n      try {\n        /**\n         * ######################################################################\n         * Initialize Fastlane components\n         * ######################################################################\n         */\n\n        const {\n          identity,\n          profile,\n          FastlanePaymentComponent,\n          FastlaneWatermarkComponent,\n        } = await window.paypal.Fastlane({\n          // shippingAddressOptions: {\n          //   allowedLocations: [],\n          // },\n          // cardOptions: {\n          //   allowedBrands: [],\n          // },\n        });\n\n\n\n        const paymentComponent =\n          await FastlanePaymentComponent();\n        (\n          await FastlaneWatermarkComponent({\n            includeAdditionalInfo: true,\n          })\n        ).render(\"#watermark-container\");\n        /**\n         * ######################################################################\n         * State & data required for Fastlane\n         * ######################################################################\n         */\n\n        let memberAuthenticatedSuccessfully;\n        let email;\n        let shippingAddress;\n        let paymentToken;\n\n        /**\n         * ######################################################################\n         * Checkout form helpers\n         * (this will be different for individual websites and will depend on how\n         * your own checkout flow functions)\n         * ######################################################################\n         */\n\n        const form = document.querySelector(\"form\");\n        const customerSection = document.getElementById(\"customer\");\n        const emailSubmitButton = document.getElementById(\n          \"email-submit-button\"\n        );\n        const shippingSection = document.getElementById(\"shipping\");\n        const paymentSection = document.getElementById(\"payment\");\n        const checkoutButton = document.getElementById(\"checkout-button\");\n        let activeSection = customerSection;\n\n        const setActiveSection = (section) => {\n          activeSection.classList.remove(\"active\");\n          section.classList.add(\"active\", \"visited\");\n          activeSection = section;\n        };\n\n        const getAddressSummary = ({\n          address: {\n            addressLine1,\n            addressLine2,\n            adminArea2,\n            adminArea1,\n            postalCode,\n            countryCode,\n          } = {},\n          name: { firstName, lastName, fullName } = {},\n          phoneNumber: { countryCode: telCountryCode, nationalNumber } = {},\n        }) => {\n          const isNotEmpty = (field) => !!field;\n          const summary = [\n            fullName || [firstName, lastName].filter(isNotEmpty).join(\" \"),\n            [addressLine1, addressLine2].filter(isNotEmpty).join(\", \"),\n            [\n              adminArea2,\n              [adminArea1, postalCode].filter(isNotEmpty).join(\" \"),\n              countryCode,\n            ]\n              .filter(isNotEmpty)\n              .join(\", \"),\n            [telCountryCode, nationalNumber].filter(isNotEmpty).join(\"\"),\n          ];\n          return summary.filter(isNotEmpty).join(\"\n\");\n        };\n\n        const setShippingSummary = (address) => {\n          shippingSection.querySelector(\".summary\").innerText =\n            getAddressSummary(address);\n        };\n\n        /**\n         * ######################################################################\n         * Checkout form interactable elements\n         * (this will be different for individual websites and will depend on how\n         * your own checkout flow functions)\n         * ######################################################################\n         */\n\n        emailSubmitButton.addEventListener(\n          \"click\",\n          async () => {\n            // disable button until authentication succeeds or fails\n            emailSubmitButton.setAttribute(\"disabled\", \"\");\n\n            // reset form & state\n            email = form.elements[\"email\"].value;\n            form.reset();\n            document.getElementById(\"email-input\").value = email;\n            shippingSection.classList.remove(\"visited\");\n            setShippingSummary({});\n            paymentSection.classList.remove(\"visited\", \"pinned\");\n\n            memberAuthenticatedSuccessfully = undefined;\n            shippingAddress = undefined;\n            paymentToken = undefined;\n\n            // render payment component\n            paymentComponent.render(\"#payment-component\");\n\n            try {\n              // identify and authenticate Fastlane members\n              const { customerContextId } =\n                await identity.lookupCustomerByEmail(email);\n\n              if (customerContextId) {\n                const authResponse =\n                  await identity.triggerAuthenticationFlow(\n                    customerContextId\n                  );\n                console.log(\"Auth response:\", authResponse);\n\n                // save profile data\n                if (authResponse?.authenticationState === \"succeeded\") {\n                  memberAuthenticatedSuccessfully = true;\n                  shippingAddress =\n                    authResponse.profileData.shippingAddress;\n                  paymentToken = authResponse.profileData.card;\n                }\n              } else {\n                // user was not recognized\n                console.log(\"No customerContextId\");\n              }\n\n              // update form UI\n              customerSection.querySelector(\".summary\").innerText = email;\n              if (shippingAddress) {\n                setShippingSummary(shippingAddress);\n              }\n              if (memberAuthenticatedSuccessfully) {\n                shippingSection.classList.add(\"visited\");\n                paymentSection.classList.add(\"pinned\");\n                setActiveSection(paymentSection);\n              } else {\n                setActiveSection(shippingSection);\n              }\n            } finally {\n              // re-enable button once authentication succeeds or fails\n              emailSubmitButton.removeAttribute(\"disabled\");\n            }\n          }\n        );\n        // enable button after adding click event listener\n        emailSubmitButton.removeAttribute(\"disabled\");\n\n        document\n          .getElementById(\"email-edit-button\")\n          .addEventListener(\"click\", () => setActiveSection(customerSection));\n\n        document\n          .getElementById(\"shipping-submit-button\")\n          .addEventListener(\"click\", () => {\n            // extract form values\n            const firstName = form.elements[\"given-name\"].value;\n            const lastName = form.elements[\"family-name\"].value;\n            const addressLine1 = form.elements[\"address-line1\"].value;\n            const addressLine2 = form.elements[\"address-line2\"].value;\n            const adminArea2 = form.elements[\"address-level2\"].value;\n            const adminArea1 = form.elements[\"address-level1\"].value;\n            const postalCode = form.elements[\"postal-code\"].value;\n            const countryCode = form.elements[\"country\"].value;\n            const telCountryCode = form.elements[\"tel-country-code\"].value;\n            const telNational = form.elements[\"tel-national\"].value;\n\n            // update state & form UI\n            shippingAddress = {\n              address: {\n                addressLine1,\n                addressLine2,\n                adminArea2,\n                adminArea1,\n                postalCode,\n                countryCode,\n              },\n              name: {\n                firstName,\n                lastName,\n                fullName: [firstName, lastName]\n                  .filter((field) => !!field)\n                  .join(\" \"),\n              },\n              phoneNumber: {\n                countryCode: telCountryCode,\n                nationalNumber: telNational,\n              },\n            };\n            setShippingSummary(shippingAddress);\n            paymentComponent.setShippingAddress(shippingAddress);\n            setActiveSection(paymentSection);\n          });\n\n        document\n          .getElementById(\"shipping-edit-button\")\n          .addEventListener(\"click\", async () => {\n            if (memberAuthenticatedSuccessfully) {\n              // open Shipping Address Selector for Fastlane members\n              const { selectionChanged, selectedAddress } =\n                await profile.showShippingAddressSelector();\n\n              if (selectionChanged) {\n                // selectedAddress contains the new address\n                console.log(\"New address:\", selectedAddress);\n\n                // update state & form UI\n                shippingAddress = selectedAddress;\n                setShippingSummary(shippingAddress);\n                paymentComponent.setShippingAddress(shippingAddress);\n              } else {\n                // selection modal was dismissed without selection\n              }\n            } else {\n              setActiveSection(shippingSection);\n            }\n          });\n\n        document\n          .getElementById(\"payment-edit-button\")\n          .addEventListener(\"click\", () => setActiveSection(paymentSection));\n\n        checkoutButton.addEventListener(\"click\", async () => {\n          // disable button until transaction succeeds or fails\n          checkoutButton.setAttribute(\"disabled\", \"\");\n\n          \n    }\n\n    initFastlane();\n\n\n\n  </script>\n</body>\n\n</html>\n\n";
};
exports.POCWEPAY = POCWEPAY;
