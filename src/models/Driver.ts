import { Schema, model, Document } from 'mongoose';

interface ITieredRate {
  upToKm: number;
  rate: number;
}

export interface IPricing {
  baseRate: number;
  perKm: number;
  perMinute: number;
  minFare: number; // Added minFare to IPricing
  tieredRates: ITieredRate[];
  ratePerMinute: number;
  nightSurchargePerKm: number;
  weekendSurchargePerKm: number;
  holidaySurchargePerKm: number;
  driverProvince: string;
  applyWeekendSurchargeOnHoliday: boolean;
  freeSuitcasesPerPassenger: number;
  surchargePerExtraSuitcase: number;
  passengerSurchargeEnabled: boolean;
  minPassengersForSurcharge: number;
  surchargePerKmPerExtraPassenger: number;
}

export interface IDriver extends Document {
  driverId: string;
  name: string;
  email: string;
  pricing: IPricing;
  embedSnippet: string; // Added embedSnippet property
  createdAt: Date;
  updatedAt: Date;
}

const TieredRateSchema = new Schema<ITieredRate>({
  upToKm: { type: Number, required: true },
  rate: { type: Number, required: true },
}, { _id: false });

const PricingSchema = new Schema<IPricing>({
  baseRate: { type: Number, required: true, default: 0 },
  tieredRates: { type: [TieredRateSchema], required: true, default: [] },
  ratePerMinute: { type: Number, required: true, default: 0 },
  minFare: { type: Number, required: true, default: 0 }, // Added minFare to PricingSchema
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

const DriverSchema = new Schema<IDriver>({
  driverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added email to schema
  pricing: { type: PricingSchema, required: true },
  embedSnippet: { type: String, default: '' }, // Added embedSnippet to schema
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update `updatedAt` field on save
DriverSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Driver = model<IDriver>('Driver', DriverSchema);

export default Driver;