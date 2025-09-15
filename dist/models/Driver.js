"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TieredRateSchema = new mongoose_1.Schema({
    upToKm: { type: Number, required: true },
    rate: { type: Number, required: true },
}, { _id: false });
const PricingSchema = new mongoose_1.Schema({
    baseRate: { type: Number, required: true, default: 0 },
    tieredRates: { type: [TieredRateSchema], required: true, default: [] },
    ratePerMinute: { type: Number, required: true, default: 0 },
    nightSurchargePerKm: { type: Number, required: true, default: 0 },
    weekendSurchargePerKm: { type: Number, required: true, default: 0 },
    holidaySurchargePerKm: { type: Number, required: true, default: 0 },
    driverProvince: { type: String, required: true, default: '' },
    applyWeekendSurchargeOnHoliday: { type: Boolean, required: true, default: true },
    freeSuitcasesPerPassenger: { type: Number, required: true, default: 1 },
    surchargePerExtraSuitcase: { type: Number, required: true, default: 0 },
    passengerSurchargeEnabled: { type: Boolean, required: true, default: false },
    minPassengersForSurcharge: { type: Number, required: true, default: 1 },
    surchargePerKmPerExtraPassenger: { type: Number, required: true, default: 0 },
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
