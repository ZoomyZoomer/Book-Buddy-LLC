import jwt from 'jsonwebtoken';
import cookie from 'cookie'; // Vercel requires this package for handling cookies

const secret = 'asdjaisd1203810'; // Ideally, store this in environment variables

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = cookie.parse(req.headers.cookie || '');

    if (!token) {
      // No token means not logged in
      return res.status(401).json({ message: 'Not logged in' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
        // If there is an error, user isn't logged in
        return res.status(401).json({ message: 'Not logged in, invalid token' });
      }

      // Verification successful
      res.status(200).json({ message: 'Logged in', user: info });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}