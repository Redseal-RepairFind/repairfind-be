"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorStripeAccountPipeline = void 0;
exports.ContractorStripeAccountPipeline = [
    {
        $addFields: {
            stripeAccountStatus: {
                details_submitted: "$stripeAccount.details_submitted",
                payouts_enabled: "$stripeAccount.payouts_enabled",
                charges_enabled: "$stripeAccount.charges_enabled",
                transfers_enabled: {
                    $cond: {
                        if: { $ifNull: ["$stripeAccount.capabilities.transfers", "inactive"] }, //{ $eq: ["$stripeAccount.capabilities.transfers", "active"] },
                        then: true,
                        else: false
                    }
                },
                card_payments_enabled: {
                    $cond: {
                        if: { $ifNull: ["$stripeAccount.capabilities.card_payments", "inactive"] }, //{ $eq: ["$stripeAccount.capabilities.card_payments", "active"] },
                        then: true,
                        else: false
                    }
                },
                status: {
                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$stripeAccount.capabilities.card_payments", "active"] },
                                { $eq: ["$stripeAccount.capabilities.transfers", "active"] }
                            ]
                        },
                        then: 'active',
                        else: 'inactive'
                    }
                }
            }
        }
    },
];
