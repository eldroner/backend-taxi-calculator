"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const driver_routes_1 = __importDefault(require("./routes/driver.routes")); // Import driver routes
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taxicalculator';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Use driver routes
app.use('/api/drivers', driver_routes_1.default);
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
