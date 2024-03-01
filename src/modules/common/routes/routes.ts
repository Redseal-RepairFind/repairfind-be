import { CommonController } from "../controllers/common.controller";


const express = require("express");
const router = express.Router();

router.get("/bank-lists",  CommonController.getBankList ); // customer update is profile


export default router;