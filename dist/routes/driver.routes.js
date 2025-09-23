"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const driver_controller_1 = require("../controllers/driver.controller");
const router = (0, express_1.Router)();
// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private (Admin only)
router.get('/', auth_middleware_1.protect, driver_controller_1.getDrivers);
// @desc    Get driver by ID
// @route   GET /api/drivers/:driverId
// @access  Public
router.get('/:driverId', driver_controller_1.getDriverById);
// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private (Admin only)
router.post('/', auth_middleware_1.protect, driver_controller_1.createDriver);
// @desc    Update a driver
// @route   PUT /api/drivers/:driverId
// @access  Private (Admin only)
router.put('/:driverId', auth_middleware_1.protect, driver_controller_1.updateDriver);
// @desc    Delete a driver
// @route   DELETE /api/drivers/:driverId
// @access  Private (Admin only)
router.delete('/:driverId', auth_middleware_1.protect, driver_controller_1.deleteDriver);
exports.default = router;
