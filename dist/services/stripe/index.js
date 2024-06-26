"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
var session = __importStar(require("./session.stripe"));
var customer = __importStar(require("./customer.stripe"));
var identity = __importStar(require("./identity.stripe"));
var webhook = __importStar(require("./webhook.stripe"));
var payment = __importStar(require("./payment.stripe"));
var file = __importStar(require("./file.stripe"));
var account = __importStar(require("./account.stripe"));
var transfer = __importStar(require("./transfer.stripe"));
exports.StripeService = {
    session: session,
    customer: customer,
    identity: identity,
    webhook: webhook,
    payment: payment,
    file: file,
    account: account,
    transfer: transfer
};
