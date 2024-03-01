"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_controller_1 = require("../controllers/common.controller");
var express = require("express");
var router = express.Router();
router.get("/bank-lists", common_controller_1.CommonController.getBankList); // customer update is profile
exports.default = router;
