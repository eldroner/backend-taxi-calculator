import { Schema, model, Document } from 'mongoose';

interface ITieredRate {
  upToKm: number;
  rate: number;
}

interface IPricing {
  baseRate: number;
  tieredRates: ITieredRate[];
  ratePerMinute: number;
  nightSurchargePerKm: number;
  weekendSurchargePerKm: number;
  holidaySurchargePerKm: number;
  driverProvince: string;
  freeSuitcasesPerPassenger: number;
  surchargePerExtraSuitcase: number;
  passengerSurchargeEnabled: boolean;
  minPassengersForSurcharge: number;
  surchargePerKmPerExtraPassenger: number;
}

interface IDriver extends Document {
  driverId: string;
  name: string;
  pricing: IPricing;
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
  nightSurchargePerKm: { type: Number, required: true, default: 0 },
  weekendSurchargePerKm: { type: Number, required: true, default: 0 },
  holidaySurchargePerKm: { type: Number, required: true, default: 0 },
  driverProvince: { type: String, required: true, default: '' },
  freeSuitcasesPerPassenger: { type: Number, required: true, default: 1 },
  surchargePerExtraSuitcase: { type: Number, required: true, default: 0 },
  passengerSurchargeEnabled: { type: Boolean, required: true, default: false },
  minPassengersForSurcharge: { type: Number, required: true, default: 1 },
  surchargePerKmPerExtraPassenger: { type: Number, required: true, default: 0 },
}, { _id: false });

const DriverSchema = new Schema<IDriver>({
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

const Driver = model<IDriver>('Driver', DriverSchema);

export default Driver;
