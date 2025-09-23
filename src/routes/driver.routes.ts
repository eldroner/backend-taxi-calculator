import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getDrivers, getDriverById, createDriver, updateDriver, deleteDriver } from '../controllers/driver.controller';

const router = Router();

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private (Admin only)
router.get('/', protect, getDrivers);

// @desc    Get driver by ID
// @route   GET /api/drivers/:driverId
// @access  Public
router.get('/:driverId', getDriverById);

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private (Admin only)
router.post('/', protect, createDriver);

// @desc    Update a driver
// @route   PUT /api/drivers/:driverId
// @access  Private (Admin only)
router.put('/:driverId', protect, updateDriver);

// @desc    Delete a driver
// @route   DELETE /api/drivers/:driverId
// @access  Private (Admin only)
router.delete('/:driverId', protect, deleteDriver);

export default router;
