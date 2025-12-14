import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Sweet Shop API is running');
});

export default app;