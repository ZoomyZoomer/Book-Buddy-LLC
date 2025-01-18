import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {

    const { username, info } = req.body;

    try {

        await connectToDatabase();

        const shelf = await Bookshelf.findOne({ username: username });
        if (!shelf) {
            return res.status(404).json({ message: 'Bookshelf not found' });
        }

        shelf.goals_set = info;
        await shelf.save();

        res.status(200).json({message: 'Goals updated'})

    } catch(e) {
        console.error(e);
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }

}