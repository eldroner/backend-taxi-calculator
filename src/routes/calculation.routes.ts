import { Router } from 'express';
import { calculatePrice } from '../controllers/calculation.controller';

const router = Router();

// @desc    Calculate price for a driver
// @route   POST /api/calculate
// @access  Public
router.post('/', calculatePrice);

export default router;
