import { Router } from 'express';
import Driver from '../models/Driver';

const router = Router();

// POST /api/drivers - Register a new driver or update if exists
router.post('/', async (req, res) => {
  try {
    const { driverId, name, pricing } = req.body;
    let driver = await Driver.findOne({ driverId });

    if (driver) {
      // Update existing driver
      driver.name = name || driver.name;
      driver.pricing = pricing || driver.pricing;
      await driver.save();
      return res.status(200).json(driver);
    } else {
      // Create new driver
      driver = new Driver({ driverId, name, pricing });
      await driver.save();
      return res.status(201).json(driver);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/drivers/:driverId - Get pricing configuration for a specific driver
router.get('/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = await Driver.findOne({ driverId });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/drivers/:driverId - Update pricing configuration for a specific driver
router.put('/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { name, pricing } = req.body;

    const driver = await Driver.findOneAndUpdate(
      { driverId },
      { name, pricing, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
