import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import User from './models/User'; // Adjust the path if necessary

export default async function handler(req, res) {

    const {email, avid} = req.body;

    try {

        await connectToDatabase();

        const user = await User.findOne({ email });
        user.reader = avid;

        await user.save();

        res.status(200).json({message: `User marked as a ${avid} reader`});

    } catch(e) {
        res.status(500).json({message: "Could not update user's reader status"});
    }

}