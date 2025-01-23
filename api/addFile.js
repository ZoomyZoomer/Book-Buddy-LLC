import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {

    const { username, id, quantity } = req.body;

    try {

        await connectToDatabase();

        const inventory = await Inventory.findOne({ username: username });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        // See if file already exists
        const file_item = inventory.files.find((file) => file.file_id === id);
        if (file_item) {
            file_item.quantity += 1;
        } else {
            inventory.files.push({file_id: id, quantity});
        }

        await inventory.save();

        return res.status(200).json({message: 'File successfully added'});

    } catch(e) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }

}