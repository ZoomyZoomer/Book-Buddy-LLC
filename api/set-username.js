import { connectToDatabase } from './utils/db';
import User from './models/User';

export default async function handler(req, res) {

    const { email, username } = req.body;

    try {

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user){
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username;
        await user.save();

        return res.status(200).json({message: "Username successfully updated"});

    } catch(e) {

    }

}
