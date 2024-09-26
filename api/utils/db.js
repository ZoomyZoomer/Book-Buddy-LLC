import { MongoClient } from 'mongodb';

// Connection string stored in environment variable
const uri = "mongodb+srv://kcw90:oJQDQrLG9h466RKf@cluster0.ajxucqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let client;
let clientPromise;

// Ensure MongoClient is only created once
if (!uri) {
  throw new Error('Please add your Mongo URI to the environment variables');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the MongoClient instance between hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, reuse the client promise
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const connection = await clientPromise;
  return connection.db('myDatabase'); // Replace 'myDatabase' with your actual DB name
}