import { EventEmitter } from 'events';
import { Logger } from '../services/logger';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { EmailService } from '../services';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { i18n } from '../i18n';
import { PromotionModel } from '../database/common/promotion.schema';
import { GeneratorUtil } from '../utils/generator.util';
import { IReferral } from '../database/common/referral.schema';
import { CouponModel } from '../database/common/coupon.schema';

export const PromotionEvent: EventEmitter = new EventEmitter();

PromotionEvent.on('NEW_REFERRAL', async function (payload: { referral: IReferral }) {
    try {
        Logger.info(`Handling NEW_REFERRAL event`);
        const referral = payload.referral;

        const referrer = (referral.referrerType === 'customers') 
            ? await CustomerModel.findById(referral.referrer) 
            : await ContractorModel.findById(referral.referrer);
        
        const referralPromotion = await PromotionModel.findOne({ code: 'REFERRAL', status: 'active' });
        if (!referralPromotion) return;

        // If Referral promotion is ongoing, create user coupon for the referral bonus
        const couponCode = await GeneratorUtil.generateCouponCode(6);
        const coupon = await CouponModel.create({
            name: 'Referral Bonus',
            code: couponCode,
            user: referral.referrer,
            userType: referral.referrerType,
            type: 'referral',
            valueType: 'fixed',
            value: referralPromotion.value,
            applicableAtCheckout: true,
            status: 'pending',
        });
        referral.coupon = coupon.id;
        await referral.save();

        if (referrer) {
            const emailSubject = 'Congratulations! You’ve Earned a Referral Bonus!';
            const bonusActivation = (referral.referrerType === 'customers') 
                ? 'when the referred customer books their first job.'
                : 'when the referred contractor completes their first job.';

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
            EmailService.send(referrer.email, translatedSubject, translatedHtml);
        }

    } catch (error) {
        Logger.error(`Error handling NEW_REFERRAL event: ${error}`);
    }
});
