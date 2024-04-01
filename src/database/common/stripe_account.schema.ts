export type IStripeAccount = {
    id: string;
    business_profile: any; // Adjust type as needed
    capabilities: any; // Adjust type as needed
    charges_enabled: boolean;
    country: string;
    default_currency: string;
    details_submitted: boolean;
    requirements: any; // Adjust type as needed
    payouts_enabled: boolean;
    type: string;
    external_accounts: any; // Adjust type as needed
    metadata: any; // Adjust type as needed
    // Add any other properties you want to include
}