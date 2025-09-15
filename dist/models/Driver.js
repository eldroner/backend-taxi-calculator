"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PricingSchema = new mongoose_1.Schema({
    baseRate: { type: Number, required: true, default: 0 },
    ratePerKm: { type: Number, required: true, default: 0 },
    ratePerMinute: { type: Number, required: true, default: 0 },
    nightSurcharge: { type: Number, required: true, default: 0 },
    weekendSurcharge: { type: Number, required: true, default: 0 },
    luggageSurcharge: { type: Number, required: true, default: 0 },
    passengerSurcharge: { type: Number, required: true, default: 0 },
}, { _id: false });
const DriverSchema = new mongoose_1.Schema({
    driverId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    pricing: { type: PricingSchema, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
// Update `updatedAt` field on save
DriverSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
const Driver = (0, mongoose_1.model)('Driver', DriverSchema);
exports.default = Driver;
