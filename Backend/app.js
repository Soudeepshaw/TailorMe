const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const s3AuthMiddleware = require('./middleware/s3AuthMiddleware');


// Route imports
const uploadRoutes = require('./routes/uploadRoutes');
const customerRoutes = require('./routes/customer');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tailorRoutes = require('./routes/tailors');
const orderRoutes = require('./routes/orders');
const catalogRoutes = require('./routes/catalog');
const fabricRoutes = require('./routes/fabrics');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tailors', tailorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/fabrics', fabricRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);


// Error handling middleware
app.use(errorHandler);

module.exports = app;