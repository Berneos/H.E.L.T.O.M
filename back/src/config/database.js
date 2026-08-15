const mongoose = require('mongoose');

async function connectDB(uri) {
  const mongoUri = uri || process.env.DATABASE_URL || 'mongodb+srv://hollow:helton@cluster0.hder8am.mongodb.net/?appName=Cluster0';
  try {
    // Mongoose 6+ no longer accepts `useNewUrlParser` / `useUnifiedTopology` here.
    // Pass the connection string only; mongoose applies sensible defaults.
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connectDB, mongoose };
