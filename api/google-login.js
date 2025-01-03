import User from './models/User';
import { connectToDatabase } from './utils/db';

export default async function handler(req, res) {

    const { email, name } = req.query

    try {

        await connectToDatabase();

        const userDoc = await User.findOne({ email });

        if (!userDoc) {

            await User.create({
                username: name,
                email,
                password: 'null',
                googleAuth: true
            });

            return res.status(200).json(0);
        } 

        if (userDoc.googleAuth){
            jwt.sign({ username: userDoc.username, id: userDoc._id }, secret, {}, (err, token) => {
                  if (err) throw err;
    
                // Set the token in cookies
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
                    sameSite: 'strict',
                    path: '/',
                }));
            
                    // Return user details as a JSON response
                res.status(200).json(1);
            });
        } else {
            res.status(200).json(2);
        }
        
      


    } catch(e) {
        return res.status(500).json({error: e});
    }

}