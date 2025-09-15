"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Driver_1 = __importDefault(require("../models/Driver"));
const router = (0, express_1.Router)();
// POST /api/drivers - Register a new driver or update if exists
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId, name, pricing } = req.body;
        let driver = yield Driver_1.default.findOne({ driverId });
        if (driver) {
            // Update existing driver
            driver.name = name || driver.name;
            driver.pricing = pricing || driver.pricing;
            yield driver.save();
            return res.status(200).json(driver);
        }
        else {
            // Create new driver
            driver = new Driver_1.default({ driverId, name, pricing });
            yield driver.save();
            return res.status(201).json(driver);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// GET /api/drivers/:driverId - Get pricing configuration for a specific driver
router.get('/:driverId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        const driver = yield Driver_1.default.findOne({ driverId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// PUT /api/drivers/:driverId - Update pricing configuration for a specific driver
router.put('/:driverId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        const { name, pricing } = req.body;
        const driver = yield Driver_1.default.findOneAndUpdate({ driverId }, { name, pricing, updatedAt: new Date() }, { new: true, runValidators: true });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
