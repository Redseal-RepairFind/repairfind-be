import { EventEmitter } from 'events';
import { Logger } from '../services/logger';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { EmailService } from '../services';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { i18n } from '../i18n';
import { IPromotion, PROMOTION_STATUS, PromotionModel } from '../database/common/promotion.schema';
import { GeneratorUtil } from '../utils/generator.util';
import { IReferral } from '../database/common/referral.schema';
import { COUPON_STATUS, COUPON_TYPE, COUPON_VALUE_TYPE, CouponModel } from '../database/common/coupon.schema';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { IContractor } from '../database/contractor/interface/contractor.interface';

export const PromotionEvent: EventEmitter = new EventEmitter();

PromotionEvent.on('NEW_REFERRAL', async function (payload: { referral: IReferral }) {
    try {
        Logger.info(`Handling NEW_REFERRAL event`);
        const referral = payload.referral;

        const referrer = (referral.referrerType === 'customers') 
            ? await CustomerModel.findById(referral.referrer) 
            : await ContractorModel.findById(referral.referrer);
        
        const referralPromotion = await PromotionModel.findOne({ code: 'REFERRAL', status: PROMOTION_STATUS.ACTIVE });

        if (!referralPromotion) return;

        // Check for limits
        if (referral.referrerType === 'contractors' && referralPromotion.contractorLimit <= 0) return;
        if (referral.referrerType === 'customers' && referralPromotion.customerLimit <= 0) return;

        // If Referral promotion is ongoing, create user coupon for the referral bonus
        const couponCode = await GeneratorUtil.generateCouponCode(6);
        const coupon = await CouponModel.create({
            promotion: referralPromotion.id,
            name: 'Referral Bonus',
            code: couponCode,
            user: referral.referrer,
            userType: referral.referrerType,
            type: COUPON_TYPE.REFERRAL_BONUS,
            valueType: COUPON_VALUE_TYPE.FIXED,
            value: referralPromotion.value,
            applicableAtCheckout: true,
            status: COUPON_STATUS.PENDING,  // TODO: Track and enable when refered user performs a transactable , job completion is a good place
        });

        referral.coupon = coupon.id;
        await referral.save();

        // Decrease promotion limit
        if (referral.referrerType === 'contractors') {
            referralPromotion.contractorLimit -= 1;
        } else if (referral.referrerType === 'customers') {
            referralPromotion.customerLimit -= 1;
        }
        await referralPromotion.save();

        if (referrer) {
            const bonusActivation = (referral.referrerType === 'customers') 
                ? 'when the referred customer books their first job.'
                : 'when the referred contractor completes their first job';

            await sendReferralEmail(referrer, couponCode, referralPromotion, bonusActivation);
        }

    } catch (error) {
        Logger.error(`Error handling NEW_REFERRAL event: ${error}`);
    }
});

const sendReferralEmail = async (referrer: ICustomer | IContractor, couponCode: any, referralPromotion: IPromotion, bonusActivation: any) => {
    const emailSubject = 'Congratulations! You’ve Earned a Referral Bonus!';
    const emailContent = `
        <h2>${emailSubject}</h2>
        <p>Hello ${referrer.firstName},</p>
        <p style="color: #333333;">Great news! You have successfully referred a user to Repairfind!</p>
        <p style="color: #333333;">Your referral coupon code is <strong>${couponCode}</strong>.</p>
        <p style="color: #333333;">This bonus of <strong>$${referralPromotion.value}</strong> will be activated ${bonusActivation}</p>
        <p style="color: #333333;">Thank you for sharing the word and helping us grow our community!</p>
        <p style="color: #333333;">Best regards,<br>Your Repairfind Team</p>
    `;
    const html = GenericEmailTemplate({ name: referrer.firstName, subject: emailSubject, content: emailContent });
    const translatedHtml = await i18n.getTranslation({ phraseOrSlug: html, targetLang: referrer.language, saveToFile: false, useGoogle: true, contentType: 'html' }) || html;
    const translatedSubject = await i18n.getTranslation({ phraseOrSlug: emailSubject, targetLang: referrer.language }) || emailSubject;
    await EmailService.send(referrer.email, translatedSubject, translatedHtml);
};
