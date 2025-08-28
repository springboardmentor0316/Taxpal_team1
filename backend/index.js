import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
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
