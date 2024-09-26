import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, file, quant } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find the file in the user's inventory
      const myFile = inventory.files.find(files => files.file_id === file.id);
      if (!myFile) {
        return res.status(404).json({ message: 'File not found in inventory' });
      }

      // Validate the quantity to sell
      if (myFile.quantity < quant) {
        return res.status(400).json({ message: 'Invalid amount' });
      }

      // Update the file quantity and user's currency
      myFile.quantity -= quant;
      inventory.currency.coins += (file.value * quant);

      await inventory.save();

      res.status(200).json({ message: 'File(s) successfully sold' });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
