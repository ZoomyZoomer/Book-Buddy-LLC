import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import User from './models/User'; // Adjust the path if necessary
import nodemailer from 'nodemailer'; // Use `import` for consistency in ESModules
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {

    const { email, code } = req.body;

    try {

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if ((user.verificationCode === code)){
            await user.save();

            return res.status(200).json("success");
        }

        return res.status(400).json('Invalid code');

    } catch(e) {
        return res.status(500).json({ message: 'Failed to verify email' });
    }

}