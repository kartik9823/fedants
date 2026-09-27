require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const competitionRoutes = require('./routes/competitionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/competitions', competitionRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
);

// Global Error Handler
app.use(errorHandler);

// MongoDB Connection & Server Bootstrap
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedants';

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
  } catch (err) {
    console.log('Local MongoDB not available. Starting MongoDB Memory Server fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`Connected to in-memory MongoDB at ${uri}`);
    } catch (memErr) {
      console.error('Failed to connect to MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

startServer();
