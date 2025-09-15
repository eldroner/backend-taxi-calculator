import { Schema, model, Document } from 'mongoose';

interface IPricing {
  baseRate: number;
  ratePerKm: number;
  ratePerMinute: number;
  nightSurcharge: number;
  weekendSurcharge: number;
  luggageSurcharge: number;
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

const PricingSchema = new Schema<IPricing>({
  baseRate: { type: Number, required: true, default: 0 },
  ratePerKm: { type: Number, required: true, default: 0 },
  ratePerMinute: { type: Number, required: true, default: 0 },
  nightSurcharge: { type: Number, required: true, default: 0 },
  weekendSurcharge: { type: Number, required: true, default: 0 },
  luggageSurcharge: { type: Number, required: true, default: 0 },
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
