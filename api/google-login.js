import User from './models/User';
import { connectToDatabase } from './utils/db';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const secret = 'asdjaisd1203810';

export default async function handler(req, res) {
    const { email, name } = req.query;

    try {
        await connectToDatabase();

        const userDoc = await User.findOne({ email });

        if (!userDoc) {
            await User.create({
                username: name,
                email,
                password: email + '_null', // Assuming your schema allows a placeholder password
                googleAuth: true
            });

            return res.status(200).json(0);
        }

        if (userDoc.googleAuth) {
            jwt.sign(
                { username: userDoc.username, id: userDoc._id },
                secret,
                {},
                (err, token) => {
                    if (err) {
                        console.error('JWT sign error:', err);
                        return res.status(500).json({ error: 'Token generation failed' });
                    }
                    res.setHeader(
                        'Set-Cookie',
                        cookie.serialize('token', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            path: '/',
                        })
                    );
                    return res.status(200).json(1);
                }
            );
            return; // Prevent further execution since response has been sent inside jwt.sign
        }

        return res.status(200).json(2);
    } catch (e) {
        console.error('Error in handler:', e);
        return res.status(500).json({ error: e.message || e });
    }
}
