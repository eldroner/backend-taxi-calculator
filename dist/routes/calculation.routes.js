"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculation_controller_1 = require("../controllers/calculation.controller");
const router = (0, express_1.Router)();
// @desc    Calculate price for a driver
// @route   POST /api/calculate
// @access  Public
router.post('/', calculation_controller_1.calculatePrice);
exports.default = router;
