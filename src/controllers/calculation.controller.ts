import { Request, Response } from 'express';
import Driver, { IDriver, IPricing } from '../models/Driver'; // Import IPricing

export const calculatePrice = async (req: Request, res: Response) => {
  const { distance, time, driverId } = req.body;

  if (!distance || !time || !driverId) {
    return res.status(400).json({ msg: 'Please provide distance, time, and driverId' });
  }

  try {
    const driver: IDriver | null = await Driver.findOne({ driverId });

    if (!driver) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    const { baseRate, perKm, perMinute, minFare } = driver.pricing as IPricing; // Explicitly cast to IPricing

    let price = baseRate + (distance * perKm) + (time * perMinute);

    if (price < minFare) {
      price = minFare;
    }

    res.json({ price });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};