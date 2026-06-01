const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/auth/authRoute');
const userRoutes = require('./src/users/userRoute');
const volunteerRoutes = require('./src/volunteers/volunteerRoute');
const donorRoutes = require('./src/donors/donorRoute');
const uploadRoutes = require('./src/uploads/uploadRoute');
const healthRoutes = require('./src/health/healthRoute');
const testRoutes = require('./src/test/testRoute');

const donationRoutes = require('./src/donations/donationRoute');
const analyticsRoutes = require('./src/analytics/analyticsRoute');
const matchingRoutes = require('./src/matching/matchingRoute');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.use('/api/v1/health', healthRoutes);

// Test endpoints (no auth required)
app.use('/api/v1/test', testRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/volunteers', volunteerRoutes);
app.use('/api/v1/donors', donorRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/matching', matchingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;