import { validationResult } from "express-validator";
import { uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import { sendEmail } from "../../../utils/send_email_utility";
import AdminRegModel from "../../../database/admin/models/admin.model";
import SkillRegrModel from "../../../database/admin/models/skill.model";
import fetch from "node-fetch";
import AdminNoficationModel from "../../../database/admin/models/admin_notification.model";
import { htmlContractorDocumentValidatinToAdminTemplate } from "../../../templates/adminEmail/adminContractorDocumentTemplate";
import { htmlContractorDocumentValidatinTemplate } from "../../../templates/contractorEmail/contractorDocumentTemplate";


//contractor add or validate document /////////////
export const contractorAddDocumentController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        phoneNumber,
        businessName,
        //gst,
        tradeTicket,
        state,
        postalCode,
        city,
        skill,
        website,
        //validId,
        yearExpirence,
      } = req.body;
  
      const files = req.files;

      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      const checkDocument = await ContractorDocumentValidateModel.findOne({contractorId: contractorId})

      if (checkDocument) {
        return res
          .status(401)
          .json({ message: "document already exist" });
      }
  
      if (!files) {
        return res
          .status(401)
          .json({ message: "files are missing" });
      }

      if (files.length > 1 || files.length < 1) {
        return res
        .status(401)
        .json({ message: "files must be one, profile" });
      }

      if (files[0].fieldname != 'profile') {
        return res
        .status(401)
        .json({ message: "the first file must be profile" });
      }

      let certnToken = process.env.CERTN_KEY

      if (!certnToken) {
        return res
          .status(401)
          .json({ message: "Certn API Key is missing" });
      }

      console.log(3)

      const filenameOne = uuidv4();
      const documentOne = await uploadToS3(files[0].buffer, `${filenameOne}.jpg`);

      // const filenameTwo = uuidv4();
      // const documentTwo = await uploadToS3(files[1].buffer, `${filenameTwo}.jpg`);

      const profile = documentOne?.Location;
      // const nationIdImage  = documentTwo?.Location;

      const data = {
        request_enhanced_identity_verification: true,
        request_enhanced_criminal_record_check: true,
        email: contractorExist.email
      };

      const options = {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${certnToken}`,
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${certnToken}`
        },
        body: JSON.stringify(data),
      };

      const certn = await fetch("https://api.certn.co/hr/v1/applications/invite/", options)

      console.log(4)

      const certnData =  await certn.json()

      if (certnData.applicant.status != 'Pending') {
        return res
          .status(401)
          .json({ message: "unable to initialize certn invite" });
      }

      // update profile image
      const updateProfile = await ContractorModel.findOneAndUpdate(
        {_id: contractorId},
        {profileImage: profile},
        {new: true}
      )

      const newDocument = new ContractorDocumentValidateModel({
        contractorId: contractorId,
        phoneNumber,
        businessName,
        //gst,
        tradeTicket,
        state,
        postalCode,
        city,
        skill,
        website,
        //validId,
        yearExpirence,
        nationIdImage: '',
        verified: false,
        certnId: certnData.applicant.id
      })

      // send email to contractor
      const htmlCon = htmlContractorDocumentValidatinTemplate(contractorExist.firstName);

      let emailData = {
        emailTo: contractorExist.email,
        subject: "Document validation from artisan",
        html: htmlCon
      };

      sendEmail(emailData);
      
      // send email to admin
      const html = htmlContractorDocumentValidatinToAdminTemplate(contractorExist.firstName)
      const admins = await AdminRegModel.find();

      for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];

        if (admin.validation) {
          let emailData = {
            emailTo: admin.email,
            subject: "Document validation from artisan",
            html
          };
    
          sendEmail(emailData);

        }
        
      }

      // save document
      const saveDocument = await newDocument.save()
    
      res.json({  
        message: "document successfully submit, check your email to continue rest validation",
        saveDocument
      });
      
    } catch (err: any) {
      // signup error

      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}




//contractor comfirm certn validation /////////////
export const contractorComfirmCertnValidationController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const checkDocument = await ContractorDocumentValidateModel.findOne({contractorId: contractorId})

    if (!checkDocument) {
      return res
        .status(401)
        .json({ message: "you haven't submited document yet" });
    }

    if (checkDocument.verified) {
      return res
        .status(401)
        .json({ message: "document already verified" });
    }

    let certnToken = process.env.CERTN_KEY

    if (!certnToken) {
      return res
        .status(401)
        .json({ message: "Certn API Key is missing" });
    }

    const options = {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${certnToken}`,
        "Content-Type": "application/json",
      },
    };

    const certn = await fetch(`https://api.certn.co/hr/v1/applicants/${checkDocument.certnId}`, options)
    //const certn = await fetch(`https://api.certn.co/hr/v1/applicants/ae9df329-58e4-4d36-b3a9-ae3505aec1c0`, options)

    const certnData =  await certn.json()

    if (certnData.status == "Pending") {
      return res
        .status(401)
        .json({ message: "you haven't finished certn verification" });
    }

    if (certnData.status != "Returned") {
      return res
        .status(401)
        .json({ message: "you haven't submited document yet" });
    }

    if (certnData.information.status != "Completed") {
      return res
        .status(401)
        .json({ message: "your information is not complete or verified by certn" });
    }

    if (certnData.international_criminal_record_check_result.status != "NONE") {
      return res
        .status(401)
        .json({ 
          message: "your have criminal record",
          criminal_records: certnData.international_criminal_record_check_result.international_criminal_record_checks
        });
    }

    checkDocument.verified = true;
    // contractorExist.documentVerification = true;
    contractorExist.status = "active";

    await checkDocument.save()
    await contractorExist.save()

     // admin notification 
     const adminNoti = new AdminNoficationModel({
      title: "Contractor’s Personal Information Submitted",
      message: `${contractorExist.firstName} has successfully submitted his background check and has been verified`,
      status: "unseen"
    })

    await adminNoti.save();

    res.json({  
      message: "document successfully verified,",
    });
    
  } catch (err: any) {
    // signup error

    console.log("error", err)
    res.status(500).json({ message: err.message });
  }

}






// get all skill/////////////
export const getAllSkillController = async (
  req: any,
  res: Response,
) => {
  try {
      let {  
      
      } = req.body;

      // Check for validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      }

      const skills = await SkillRegrModel.find()

      res.json({  
          skills
      });
      
  } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
}