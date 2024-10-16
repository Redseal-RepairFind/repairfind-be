export const POCWEPAY = ({token, paypalClientId, enableCardField=false}: {token: string, paypalClientId: string,
enableCardField?: boolean }) => `
<!DOCTYPE html>
<html lang="en">
<title>Fastlane - PayPal Integration - Quick Start</title>

<head>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <form>
    <h1>Fastlane - PayPal Integration - Quick Start</h1>

    <section id="customer" class="active visited">
      <div class="header">
        <h2>Customer</h2>
        <button id="email-edit-button" type="button" class="edit-button">
          Edit
        </button>
      </div>
      <div class="summary"></div>
      <div class="email-container">
        <fieldset class="email-input-with-watermark">
          <input id="email-input" name="email" type="email" placeholder="Email" autocomplete="email" />
          <div id="watermark-container"></div>
        </fieldset>
        <button id="email-submit-button" type="button" class="submit-button" disabled>
          Continue
        </button>
      </div>
    </section>

    <hr />


    <section id="shipping">
      <div class="header">
        <h2>Shipping</h2>
        <button id="shipping-edit-button" type="button" class="edit-button">
          Edit
        </button>
      </div>
      <div class="summary"></div>
      <fieldset>
        <span>
          <input id="shipping-required-checkbox" name="shipping-required" type="checkbox" checked />
          <label for="shipping-required-checkbox">This purchase requires shipping</label>
        </span>
        <input name="given-name" placeholder="First name" autocomplete="given-name" />
        <input name="family-name" placeholder="Last name" autocomplete="family-name" />
        <input name="address-line1" placeholder="Street address" autocomplete="address-line1" />
        <input name="address-line2" placeholder="Apt., ste., bldg. (optional)" autocomplete="address-line2" />
        <input name="address-level2" placeholder="City" autocomplete="address-level2" />
        <input name="address-level1" placeholder="State" autocomplete="address-level1" />
        <input name="postal-code" placeholder="ZIP code" autocomplete="postal-code" />
        <input name="country" placeholder="Country" autocomplete="country" />
        <input name="tel-country-code" placeholder="Country calling code" autocomplete="tel-country-code" />
        <input name="tel-national" type="tel" placeholder="Phone number" autocomplete="tel-national" />
      </fieldset>
      <button id="shipping-submit-button" type="button" class="submit-button">
        Continue
      </button>
    </section>

    <hr />

    <section id="payment">
      <div class="header">
        <h2>Payment</h2>
        <button id="payment-edit-button" type="button" class="edit-button">
          Edit
        </button>
      </div>
      <fieldset>
        <div id="payment-component"></div>
      </fieldset>
    </section>

    <button id="checkout-button" type="button" class="submit-button">
      Checkout
    </button>
  </form>


  <script
    src="https://www.paypal.com/sdk/js?client-id=AYcL710NkfmeLv4MvDn_41alzWrdzUk2y3RtgixQVxKYExfcm7nADdnH9jikjJqaRXCCyUziUEZW0FrB&components=buttons%2Cfastlane"
    data-sdk-client-token="eyJraWQiOiJkMTA2ZTUwNjkzOWYxMWVlYjlkMTAyNDJhYzEyMDAwMiIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJpc3MiOiJodHRwczovL2FwaS5zYW5kYm94LnBheXBhbC5jb20iLCJhdWQiOlsiaHR0cHM6Ly9hcGkuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJwYXlwYWwuY29tIl0sInN1YiI6Iko4UEdZNjM5Tk5SQ0wiLCJhY3IiOlsiY2xpZW50Il0sInNjb3BlIjpbIkJyYWludHJlZTpWYXVsdCJdLCJvcHRpb25zIjp7fSwiYXoiOiJjY2cxOC5zbGMiLCJleHRlcm5hbF9pZCI6WyJQYXlQYWw6SjhQR1k2MzlOTlJDTCIsIkJyYWludHJlZTo2ajdtamgycGhycGQ0aDJmIl0sImV4cCI6MTcyOTA2NzkxMCwiaWF0IjoxNzI5MDY3MDEwLCJqdGkiOiJVMkFBS3JwRHFIaWtXLUtjTjNIWk1RWWhndDQtMHJVYWRFa184Um5lX19mYkU4aHdyNkNaNjctd2pUMlJmaUNxWUJ6cDFFV1U2QzZJVndURlBLWUU2em5MZk40X20xRGJmSk45bUNaUlBxUUdwN1lLTkpHM09lR2tybVRCZXJwdyJ9.GMTDxg0C7lhpsla3_GdWHj9ZOY7D23a-Hkvs3gumJRc4azA2OsZxpayaBTtXJqYgVeG730udwglmlkXsa-q_yQ"
    data-sdk-integration-source="developer-studio" defer></script>

  <script defer>

    async function initFastlane() {
      try {
        /**
         * ######################################################################
         * Initialize Fastlane components
         * ######################################################################
         */

        const {
          identity,
          profile,
          FastlanePaymentComponent,
          FastlaneWatermarkComponent,
        } = await window.paypal.Fastlane({
          // shippingAddressOptions: {
          //   allowedLocations: [],
          // },
          // cardOptions: {
          //   allowedBrands: [],
          // },
        });



        const paymentComponent =
          await FastlanePaymentComponent();
        (
          await FastlaneWatermarkComponent({
            includeAdditionalInfo: true,
          })
        ).render("#watermark-container");
        /**
         * ######################################################################
         * State & data required for Fastlane
         * ######################################################################
         */

        let memberAuthenticatedSuccessfully;
        let email;
        let shippingAddress;
        let paymentToken;

        /**
         * ######################################################################
         * Checkout form helpers
         * (this will be different for individual websites and will depend on how
         * your own checkout flow functions)
         * ######################################################################
         */

        const form = document.querySelector("form");
        const customerSection = document.getElementById("customer");
        const emailSubmitButton = document.getElementById(
          "email-submit-button"
        );
        const shippingSection = document.getElementById("shipping");
        const paymentSection = document.getElementById("payment");
        const checkoutButton = document.getElementById("checkout-button");
        let activeSection = customerSection;

        const setActiveSection = (section) => {
          activeSection.classList.remove("active");
          section.classList.add("active", "visited");
          activeSection = section;
        };

        const getAddressSummary = ({
          address: {
            addressLine1,
            addressLine2,
            adminArea2,
            adminArea1,
            postalCode,
            countryCode,
          } = {},
          name: { firstName, lastName, fullName } = {},
          phoneNumber: { countryCode: telCountryCode, nationalNumber } = {},
        }) => {
          const isNotEmpty = (field) => !!field;
          const summary = [
            fullName || [firstName, lastName].filter(isNotEmpty).join(" "),
            [addressLine1, addressLine2].filter(isNotEmpty).join(", "),
            [
              adminArea2,
              [adminArea1, postalCode].filter(isNotEmpty).join(" "),
              countryCode,
            ]
              .filter(isNotEmpty)
              .join(", "),
            [telCountryCode, nationalNumber].filter(isNotEmpty).join(""),
          ];
          return summary.filter(isNotEmpty).join("\n");
        };

        const setShippingSummary = (address) => {
          shippingSection.querySelector(".summary").innerText =
            getAddressSummary(address);
        };

        /**
         * ######################################################################
         * Checkout form interactable elements
         * (this will be different for individual websites and will depend on how
         * your own checkout flow functions)
         * ######################################################################
         */

        emailSubmitButton.addEventListener(
          "click",
          async () => {
            // disable button until authentication succeeds or fails
            emailSubmitButton.setAttribute("disabled", "");

            // reset form & state
            email = form.elements["email"].value;
            form.reset();
            document.getElementById("email-input").value = email;
            shippingSection.classList.remove("visited");
            setShippingSummary({});
            paymentSection.classList.remove("visited", "pinned");

            memberAuthenticatedSuccessfully = undefined;
            shippingAddress = undefined;
            paymentToken = undefined;

            // render payment component
            paymentComponent.render("#payment-component");

            try {
              // identify and authenticate Fastlane members
              const { customerContextId } =
                await identity.lookupCustomerByEmail(email);

              if (customerContextId) {
                const authResponse =
                  await identity.triggerAuthenticationFlow(
                    customerContextId
                  );
                console.log("Auth response:", authResponse);

                // save profile data
                if (authResponse?.authenticationState === "succeeded") {
                  memberAuthenticatedSuccessfully = true;
                  shippingAddress =
                    authResponse.profileData.shippingAddress;
                  paymentToken = authResponse.profileData.card;
                }
              } else {
                // user was not recognized
                console.log("No customerContextId");
              }

              // update form UI
              customerSection.querySelector(".summary").innerText = email;
              if (shippingAddress) {
                setShippingSummary(shippingAddress);
              }
              if (memberAuthenticatedSuccessfully) {
                shippingSection.classList.add("visited");
                paymentSection.classList.add("pinned");
                setActiveSection(paymentSection);
              } else {
                setActiveSection(shippingSection);
              }
            } finally {
              // re-enable button once authentication succeeds or fails
              emailSubmitButton.removeAttribute("disabled");
            }
          }
        );
        // enable button after adding click event listener
        emailSubmitButton.removeAttribute("disabled");

        document
          .getElementById("email-edit-button")
          .addEventListener("click", () => setActiveSection(customerSection));

        document
          .getElementById("shipping-submit-button")
          .addEventListener("click", () => {
            // extract form values
            const firstName = form.elements["given-name"].value;
            const lastName = form.elements["family-name"].value;
            const addressLine1 = form.elements["address-line1"].value;
            const addressLine2 = form.elements["address-line2"].value;
            const adminArea2 = form.elements["address-level2"].value;
            const adminArea1 = form.elements["address-level1"].value;
            const postalCode = form.elements["postal-code"].value;
            const countryCode = form.elements["country"].value;
            const telCountryCode = form.elements["tel-country-code"].value;
            const telNational = form.elements["tel-national"].value;

            // update state & form UI
            shippingAddress = {
              address: {
                addressLine1,
                addressLine2,
                adminArea2,
                adminArea1,
                postalCode,
                countryCode,
              },
              name: {
                firstName,
                lastName,
                fullName: [firstName, lastName]
                  .filter((field) => !!field)
                  .join(" "),
              },
              phoneNumber: {
                countryCode: telCountryCode,
                nationalNumber: telNational,
              },
            };
            setShippingSummary(shippingAddress);
            paymentComponent.setShippingAddress(shippingAddress);
            setActiveSection(paymentSection);
          });

        document
          .getElementById("shipping-edit-button")
          .addEventListener("click", async () => {
            if (memberAuthenticatedSuccessfully) {
              // open Shipping Address Selector for Fastlane members
              const { selectionChanged, selectedAddress } =
                await profile.showShippingAddressSelector();

              if (selectionChanged) {
                // selectedAddress contains the new address
                console.log("New address:", selectedAddress);

                // update state & form UI
                shippingAddress = selectedAddress;
                setShippingSummary(shippingAddress);
                paymentComponent.setShippingAddress(shippingAddress);
              } else {
                // selection modal was dismissed without selection
              }
            } else {
              setActiveSection(shippingSection);
            }
          });

        document
          .getElementById("payment-edit-button")
          .addEventListener("click", () => setActiveSection(paymentSection));

        checkoutButton.addEventListener("click", async () => {
          // disable button until transaction succeeds or fails
          checkoutButton.setAttribute("disabled", "");

          
    }

    initFastlane();



  </script>
</body>

</html>

`;