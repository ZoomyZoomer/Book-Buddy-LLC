import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {

    if (req.method === 'GET') {

        const { username } = req.query;

        try {

            await connectToDatabase();

            const shelf = await Bookshelf.findOne({ username: username });

            res.status(200).json([shelf.streak_claimed, shelf.streak]);

        } catch(e) {
        res.status(500).json({ error: 'Internal Server Error' })
        }

    } else {

        // Method not allowed
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: 'Method Not Allowed' });

    }
}