import { connectToDatabase } from './utils/db';
import Bookshelf from './models/Bookshelf'; 

export default async function handler(req, res) {

    const {username} = req.query

    try {

        await connectToDatabase();

        const shelf = await Bookshelf.findOne({ username: username });

        // If first time loading goals
        if (shelf.goals.length === 0){
            shelf.goals.push(undefined);
            shelf.goals.push(undefined);

            await shelf.save();
            res.status(200).json([undefined, undefined]);
        } else {
            res.status(200).json(shelf.goals);
        }

    } catch(e) {
        console.error("Error processing request:", e);
        res.status(500).json({ message: "Internal server error" });
    }

}