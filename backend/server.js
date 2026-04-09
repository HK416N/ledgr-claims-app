const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const logger = require('morgan');
require('./db')
const  errorHandler  = require('./middleware/errorHandler');

mongoose.set('debug', true);

//? Import routers
const authRouter = require('./routes/authRoutes');
const claimsRouter = require('./routes/claimsRoutes');
const fxRouter = require('./routes/fxRoutes');
const categoryRouter = require('./routes/categoryRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/fx', fxRouter);
app.use('/api/categories', categoryRouter);

app.use(errorHandler);

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('The express app is ready!');
});
