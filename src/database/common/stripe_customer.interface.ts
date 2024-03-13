export interface IStripeCustomer extends Document  {
    id: string;
    object?: string;
    address?: null | string;
    balance?: number;
    created?: number;
    currency?: null | string;
    default_source?: null | string;
    delinquent?: boolean;
    description?: null | string;
    discount?: null | string;
    email?: string;
    invoice_prefix?: string;
    invoice_settings?: {
      custom_fields?: null | string[];
      default_payment_method?: null | string;
      footer?: null | string;
      rendering_options?: null | string[];
    };
    livemode?: boolean;
    metadata?: Record<string, any>;
    name?: string;
    next_invoice_sequence?: number;
    phone?: null | string;
    preferred_locales?: string[];
    shipping?: null | string;
    tax_exempt?: "none" | string;
    test_clock?: null | string;
  }