const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout pour éviter les blocages
    });

    console.log('✅ MongoDB connecté avec succès !');
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB :', err.message);

    // En mode test, on lève l'erreur pour Jest
    if (process.env.NODE_ENV === 'test') {
      throw err;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
