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
exports.calculatePrice = void 0;
const Driver_1 = __importDefault(require("../models/Driver")); // Import IPricing
const calculatePrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { distance, time, driverId } = req.body;
    if (!distance || !time || !driverId) {
        return res.status(400).json({ msg: 'Please provide distance, time, and driverId' });
    }
    try {
        const driver = yield Driver_1.default.findOne({ driverId });
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        const { baseRate, perKm, perMinute, minFare } = driver.pricing; // Explicitly cast to IPricing
        let price = baseRate + (distance * perKm) + (time * perMinute);
        if (price < minFare) {
            price = minFare;
        }
        res.json({ price });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
exports.calculatePrice = calculatePrice;
