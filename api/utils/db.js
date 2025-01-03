import mongoose from 'mongoose';

let isConnected; // Track the connection state

export const connectToDatabase = async () => {
  if (isConnected) {
    return; // If already connected, skip the connection
  }

  // MongoDB URI from environment variables
  const uri = `mongodb+srv://kcw90:${process.env.MONGO_API_KEY}@cluster0.ajxucqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  // Check if the URI is defined
  if (!uri) {
    throw new Error('Please add your Mongo URI to the environment variables');
  }

  // Connect to the MongoDB database without deprecated options
  await mongoose.connect(uri);

  isConnected = true; // Update connection state
};
