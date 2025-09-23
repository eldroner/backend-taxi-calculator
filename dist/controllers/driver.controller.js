"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDriver = exports.updateDriver = exports.createDriver = exports.getDriverById = exports.getDrivers = void 0;
const Driver_1 = __importDefault(require("../models/Driver"));
// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private (Admin only)
const getDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drivers = yield Driver_1.default.find();
        res.json(drivers);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
exports.getDrivers = getDrivers;
// @desc    Get driver by ID
// @route   GET /api/drivers/:driverId
// @access  Public
const getDriverById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        const driver = yield Driver_1.default.findOne({ driverId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    }
    catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        res.status(500).send('Server Error');
    }
});
exports.getDriverById = getDriverById;
// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private (Admin only)
const createDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId, name, email, pricing } = req.body; // Changed 'rates' to 'pricing'
        let driver = yield Driver_1.default.findOne({ driverId });
        if (driver) {
            // Update existing driver
            driver.name = name || driver.name;
            driver.email = email || driver.email;
            driver.pricing = pricing || driver.pricing; // Use 'pricing'
            yield driver.save();
            return res.status(200).json(driver);
        }
        else {
            // Create new driver
            driver = (yield Driver_1.default.create({ driverId, name, email, pricing })); // Use 'pricing'
            yield driver.save();
            return res.status(201).json(driver);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.createDriver = createDriver;
// @desc    Update a driver
// @route   PUT /api/drivers/:driverId
// @access  Private (Admin only)
const updateDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        const { name, email, pricing } = req.body; // Changed 'rates' to 'pricing'
        const driver = yield Driver_1.default.findOneAndUpdate({ driverId }, { name, email, pricing, updatedAt: new Date() }, // Use 'pricing'
        { new: true, runValidators: true });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.updateDriver = updateDriver;
// @desc    Delete a driver
// @route   DELETE /api/drivers/:driverId
// @access  Private (Admin only)
const deleteDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        const driver = yield Driver_1.default.findOne({ driverId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        yield driver.deleteOne();
        res.json({ message: 'Driver removed' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
exports.deleteDriver = deleteDriver;
