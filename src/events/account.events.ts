import { EventEmitter } from 'events';
import { Logger } from '../services/logger';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { IContractor } from '../database/contractor/interface/contractor.interface';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { EmailService, NotificationService } from '../services';
import { IAbuseReport } from '../database/common/abuse_reports.model';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { i18n } from '../i18n';
import { IPromotion, PROMOTION_STATUS, PromotionModel } from '../database/common/promotion.schema';
import { GeneratorUtil } from '../utils/generator.util';
import { COUPON_STATUS, COUPON_TYPE, COUPON_VALUE_TYPE, CouponModel } from '../database/common/coupon.schema';

export const AccountEvent: EventEmitter = new EventEmitter();


AccountEvent.on('ACCOUNT_DELETED', async function (payload: { user: ICustomer|IContractor }) {
    try {

        Logger.info(`handling ACCOUNT_DELETED event`);
        const user = payload.user

        let emailSubject = 'Account Deleted '
        let emailContent = `
                <h2>${emailSubject}</h2>
                <p style="color: #333333;">Your has been deleted successfully, </p>
                <p style="color: #333333;">All pending transactions will be processed and settled in 5 business days</p>
                 <p style="color: #333333;">If you have any enquiry kindly reach via any of our available channels</p>
                <p style="color: #333333;">Thanks for your patronage</p>
                `
        let html = GenericEmailTemplate({ name: user.firstName, subject: emailSubject, content: emailContent })

        const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: user.language, saveToFile: false, useGoogle: true, contentType: 'html'}) || html;            
        const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: user.language}) || emailSubject;
        EmailService.send(user.email, translatedSubject, translatedHtml)


        // TODO: check all pending transactions and handle appropriately

        
    } catch (error) {
        Logger.error(`Error handling ACCOUNT_DELETED event: ${error}`);
    }
});


AccountEvent.on('ACCOUNT_UPDATED', async function (payload: { user: ICustomer|IContractor, userType: string}) {
    try {

        Logger.info(`handling ACCOUNT_UPDATED event`);
        const user = payload.user
        const userType = payload.userType
        //TODO: 07/10/2024

        NotificationService.sendNotification({
            user: user.id,
            userType: userType,
            title: 'Account Updated',
            type: 'ACCOUNT_UPDATED',
            message: `Your account was updated`,
            heading: { name: `${user.name}`, image: user.profilePhoto?.url },
            payload: {
                entity: user.id,
                entityType: userType == 'customers'? 'customers' : 'contractors',
                message: `Your account was updated`,
                language: user.language,
                event: 'ACCOUNT_UPDATED',
            }
        }, { socket: true });
        
    } catch (error) {
        Logger.error(`Error handling ACCOUNT_UPDATED event: ${error}`);
    }
});


AccountEvent.on('NEW_CONTRACTOR', async function (payload: { contractor: IContractor}) {
    try {

        Logger.info(`handling NEW_CONTRACTOR event`);
        const contractor = payload.contractor
        const referralPromotion = await PromotionModel.findOne({ code: 'EARLYBIRDCONTRACTOR', status: PROMOTION_STATUS.ACTIVE });
        if (!referralPromotion) return;
        if (referralPromotion.contractorLimit <= 0) return;


         // If Referral promotion is ongoing, create user coupon for the referral bonus
         const couponCode = await GeneratorUtil.generateCouponCode(6);
         const coupon = await CouponModel.create({
             promotion: referralPromotion.id,
             name: '50% Discount on Service Fee',
             code: couponCode,
             user: contractor.id,
             userType: 'contractors',
             type: COUPON_TYPE.SERVICE_FEE_DISCOUNT,
             valueType: COUPON_VALUE_TYPE.PERCENTAGE,
             value: referralPromotion.value,
             applicableAtCheckout: true,
             status: COUPON_STATUS.ACTIVE,
         });
    
        
        contractor.earlyBird = {discountRedeemed: false}
        await contractor.save()

        // Decrease promotion limit
        referralPromotion.contractorLimit -= 1;
        await referralPromotion.save();
        await sendEarlyBirdCouponEmail(contractor, referralPromotion);

    } catch (error) {
        Logger.error(`Error handling NEW_CONTRACTOR event: ${error}`);
    }
});


AccountEvent.on('ACCOUNT_REPORTED', async function (payload: { report: IAbuseReport }) {
    try {

        Logger.info(`handling ACCOUNT_REPORTED event`);
        const report = payload.report
        const reportedUser = (report.reportedType === 'customers') ? await CustomerModel.findById(report.reported) : await ContractorModel.findById(report.reported)

        if(reportedUser){
            let emailSubject = 'Account Reported '
            let emailContent = `
                    <h2>${emailSubject}</h2>
                    <p>Hello ${reportedUser.firstName},</p>
                    <p style="color: #333333;">Your account was reported for abuse and we are currently investigating your account </p>
                    <p style="color: #333333;">Please note that we operate a three(3) count strike approach, which means that three (3) consecutive reports will lead to your account being temporary suspended</p>
                     <p style="color: #333333;">If you have any enquiry or concerns kindly reach via any of our available channels</p>
                    <p style="color: #333333;">Thanks for your patronage</p>
                    `
            let html = GenericEmailTemplate({ name: reportedUser.firstName, subject: emailSubject, content: emailContent })
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: reportedUser.language, saveToFile: false, useGoogle: true, contentType: 'html'}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: reportedUser.language}) || emailSubject;
            EmailService.send(reportedUser.email, translatedSubject, translatedHtml)
        }
    
    } catch (error) {
        Logger.error(`Error handling ACCOUNT_REPORTED event: ${error}`);
    }
});


const sendEarlyBirdCouponEmail = async (contractor: IContractor, referralPromotion: IPromotion) => {
    const emailSubject = 'Welcome to Repairfind! You’ve Earned an Early Bird Discount!';
    const emailContent = `
        <h2>${emailSubject}</h2>
        <p>Hello ${contractor.firstName},</p>
        <p style="color: #333333;">We're excited to have you as one of the Early Bird Contractors on Repairfind!</p>
        <p style="color: #333333;">As a token of appreciation for joining early, you’ve earned an exclusive <strong>${referralPromotion.value}% discount</strong> on our service fee.</p>
        <p style="color: #333333;">This discount will automatically apply on your first Job.</p>
        <p style="color: #333333;">We’re thrilled to have you on board and look forward to working with you. Enjoy the perks of being an Early Bird Contractor!</p>
        <p style="color: #333333;">Best regards,<br>Your Repairfind Team</p>
    `;

    const html = GenericEmailTemplate({ name: contractor.firstName, subject: emailSubject, content: emailContent });
    const translatedHtml = await i18n.getTranslation({ phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true, contentType: 'html' }) || html;
    const translatedSubject = await i18n.getTranslation({ phraseOrSlug: emailSubject, targetLang: contractor.language }) || emailSubject;
    await EmailService.send(contractor.email, translatedSubject, translatedHtml);
};



