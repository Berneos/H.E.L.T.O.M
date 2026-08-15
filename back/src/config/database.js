const mongoose = require('mongoose');

async function connectDB(uri) {
  const mongoUri = uri || process.env.DATABASE_URL || 'mongodb+srv://hollow:helton@cluster0.hder8am.mongodb.net/?appName=Cluster0';
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connectDB, mongoose };
