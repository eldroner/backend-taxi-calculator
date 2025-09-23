import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import driverRoutes from './routes/driver.routes'; // Import driver routes
import authRoutes from './routes/auth.routes'; // Import auth routes
import calculationRoutes from './routes/calculation.routes'; // Import calculation routes
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taxicalculator';

app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

// Use driver routes
app.use('/api/drivers', driverRoutes);

// Use calculation routes
app.use('/api/calculate', calculationRoutes);

// Holiday check endpoint using Nager.Date API
app.get('/api/holidays', async (req, res) => {
  const { date, province } = req.query; // date: YYYY-MM-DD, province: ISO 3166-2 code (e.g., MD for Madrid)

  if (!date || !province) {
    return res.status(400).json({ error: 'Date and province are required.' });
  }

  try {
    const year = new Date(date as string).getFullYear();
    const nagerApiUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/ES`;

    const response = await axios.get(nagerApiUrl);
    console.log('Nager.Date API Response Data:', response.data);
    const holidays = response.data;

    let isHoliday = false;
    for (const holiday of holidays) {
      if (holiday.date === date) {
        // Check if it's a national holiday (counties is null) or a regional holiday
        const isNational = holiday.counties === null;
        const isRegionalMatch = holiday.counties && holiday.counties.includes(`ES-${province}`);

        if (isNational || isRegionalMatch) {
          isHoliday = true;
          break;
        }
      }
    }

    console.log(`Checking holiday for date: ${date}, province: ${province}. Is holiday: ${isHoliday}`);
    res.json({ isHoliday });
  } catch (error) {
    console.error('Error fetching holidays from Nager.Date API:', error);
    res.status(500).json({ error: 'Failed to fetch holiday data.' });
  }
});

app.get('/', (req, res) => {
  res.send('Taxi Calculator Backend API');
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });