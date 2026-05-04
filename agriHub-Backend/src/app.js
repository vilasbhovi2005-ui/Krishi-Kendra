const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');


require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses form data



app.use(cors({ origin: [process.env.FRONTEND_URL, 'https://krishi-kendra.vercel.app'], credentials: true }));


connectDB();

app.use('/api', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;