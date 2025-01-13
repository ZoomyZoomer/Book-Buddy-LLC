import { connectToDatabase } from './utils/db';
import Inventory from './models/Inventory';

export default async function handler(req, res) {

    const { username } = req.query;

    try {

        await connectToDatabase();

        const inventory = await Inventory.findOne({ username: username });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        return res.status(200).json(inventory.max_patch);

    } catch(e) {
        return res.status(400).json({ message: 'Could not fetch patches' });
    }
}