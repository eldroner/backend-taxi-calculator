import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import driverRoutes from './routes/driver.routes'; // Import driver routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taxicalculator';

app.use(cors());
app.use(express.json());

// Use driver routes
app.use('/api/drivers', driverRoutes);

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
