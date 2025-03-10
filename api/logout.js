import cookie from 'cookie'; // Vercel requires this package for handling cookies

export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Set the token cookie to an empty value with an immediate expiration
      res.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(0), // Expire the cookie immediately
      }));
  
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  