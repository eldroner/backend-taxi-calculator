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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const driver_routes_1 = __importDefault(require("./routes/driver.routes")); // Import driver routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // Import auth routes
const calculation_routes_1 = __importDefault(require("./routes/calculation.routes")); // Import calculation routes
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taxicalculator';
const allowedOrigins = ['https://taxi-config.pixelnova.es', 'http://localhost:4200'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Use auth routes
app.use('/api/auth', auth_routes_1.default);
// Use driver routes
app.use('/api/drivers', driver_routes_1.default);
// Use calculation routes
app.use('/api/calculate', calculation_routes_1.default);
// Holiday check endpoint using Nager.Date API
app.get('/api/holidays', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, province } = req.query; // date: YYYY-MM-DD, province: ISO 3166-2 code (e.g., MD for Madrid)
    if (!date || !province) {
        return res.status(400).json({ error: 'Date and province are required.' });
    }
    try {
        const year = new Date(date).getFullYear();
        const nagerApiUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/ES`;
        const response = yield axios_1.default.get(nagerApiUrl);
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
    }
    catch (error) {
        console.error('Error fetching holidays from Nager.Date API:', error);
        res.status(500).json({ error: 'Failed to fetch holiday data.' });
    }
}));
app.get('/', (req, res) => {
    res.send('Taxi Calculator Backend API');
});
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
