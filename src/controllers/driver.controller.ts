import { Request, Response } from 'express';
import Driver, { IDriver } from '../models/Driver';

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private (Admin only)
export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers: IDriver[] = await Driver.find();
    res.json(drivers);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get driver by ID
// @route   GET /api/drivers/:driverId
// @access  Public
export const getDriverById = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const driver: IDriver | null = await Driver.findOne({ driverId });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error: any) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Driver not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private (Admin only)
export const createDriver = async (req: Request, res: Response) => {
  try {
    const { driverId, name, email, pricing } = req.body; // Changed 'rates' to 'pricing'
    let driver: IDriver | null = await Driver.findOne({ driverId });

    if (driver) {
      // Update existing driver
      driver.name = name || driver.name;
      driver.email = email || driver.email; 
      driver.pricing = pricing || driver.pricing; // Use 'pricing'
      await driver.save();
      return res.status(200).json(driver);
    } else {
      // Create new driver
      driver = (await Driver.create({ driverId, name, email, pricing })) as IDriver; // Use 'pricing'
      await driver.save();
      return res.status(201).json(driver);
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a driver
// @route   PUT /api/drivers/:driverId
// @access  Private (Admin only)
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { name, email, pricing } = req.body; // Changed 'rates' to 'pricing'

    const driver: IDriver | null = await Driver.findOneAndUpdate(
      { driverId },
      { name, email, pricing, updatedAt: new Date() }, // Use 'pricing'
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a driver
// @route   DELETE /api/drivers/:driverId
// @access  Private (Admin only)
export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const driver: IDriver | null = await Driver.findOne({ driverId });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    await driver.deleteOne();

    res.json({ message: 'Driver removed' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};