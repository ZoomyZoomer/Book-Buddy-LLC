import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import User from './models/User'; // Adjust the path if necessary
import nodemailer from 'nodemailer'; // Use `import` for consistency in ESModules
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {

    const { email, username, password } = req.body;

    try {

        await connectToDatabase();

        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({
                username,
                email,
                password: bcrypt.hashSync(password, 10), // Adjusted salt rounds for bcrypt
            });
        } 

        // Generate a random 4-digit code
        const code = Math.floor(1000 + Math.random() * 9000);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

        // Update the user with the verification code and expiry time
        user.verificationCode = code;
        user.codeExpiresAt = expiresAt;
        await user.save();

        // Set up the transporter using environment variables
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Account',
            text: `Your Book Buddy verification code is: ${code}. It will expire in 10 minutes.`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Respond with success
        return res.status(200).json({ message: 'Verification email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send verification email' });
    }
}
