import User from '../../models/User'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie'; // Vercel requires this package for handling cookies
import { connectToDatabase } from '../../utils/db';

const secret = process.env.JWT_SECRET; // Ensure this is stored in your environment variables

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Use the connectToDatabase function to establish a database connection
      await connectToDatabase(); // You still need to connect to the database, but you won't use the db object

      // Find the user by username or email using the User model
      let userDoc = await User.findOne({ username: username });
      if (!userDoc) {
        userDoc = await User.findOne({ email: username });
      }

      // If user is not found, return an error
      if (!userDoc) {
        return res.status(400).json('Wrong credentials');
      }

      // Validate the password
      const validPassword = bcrypt.compareSync(password, userDoc.password);

      if (validPassword) {
        // Generate JWT token
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) throw err;

          // Set the token in cookies
          res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
            sameSite: 'strict',
            maxAge: 3600, // 1 hour expiry
            path: '/',
          }));

          // Return user details as a JSON response
          res.status(200).json({
            id: userDoc._id,
            username,
          });
        });
      } else {
        // Return error for invalid password
        res.status(400).json('Wrong credentials');
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
