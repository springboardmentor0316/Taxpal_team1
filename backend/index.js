import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

import taxEstimateRoutes from './routes/taxEstimate.js';

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/tax-estimate', taxEstimateRoutes);

const resolvedMongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taxpal';
console.log('MONGO_URI seen by server:', JSON.stringify(resolvedMongoUri));
mongoose.connect(resolvedMongoUri)
  .then(async () => {
 
    const User = mongoose.model('User');
    
    try {
     
      const result = await User.updateMany(
        { country: { $exists: false } },
        { $set: { country: "", income: "" } }
      );
      console.log(`Updated ${result.modifiedCount} users with default country and income values`);
    } catch (error) {
      console.error('Error updating users:', error);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
