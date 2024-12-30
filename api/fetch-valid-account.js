import { connectToDatabase } from './utils/db';
import User from './models/User';

export default async function handler(req, res) {

    const {username, email} = req.query;

    try {

        await connectToDatabase();

        const user = await User.findOne({ username });
        const user2 = await User.findOne({ email });

        if (user){
            if (user2){
                return res.status(200).json([1,1]);
            } else {
                return res.status(200).json([1,0]);
            }
        } else {
            if (user2){
                return res.status(200).json([0,1]);
            } else{
                return res.status(200).json([0,0]);
            }
        }

    } catch(e) {
        return res.status(500).json({message: 'Can not verify valid accounts'});
    }

}