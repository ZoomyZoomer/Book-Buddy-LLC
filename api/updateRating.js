import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tab_name, rating, volume_id, username } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: "Bookshelf not found" });
      }

      // Find the tab
      const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
      if (!tab) {
        return res.status(404).json({ message: "Requested tab not found" });
      }

      // Find the book
      const book = tab.books.find(book => book.volume_id === volume_id);
      if (!book) {
        return res.status(404).json({ message: "Requested book not found" });
      }

      // Update the rating of the found book
      book.rating = rating;

      // Save the updated bookshelf document
      await shelf.save();

      res.status(200).json({ message: "Rating successfully updated" });

    } catch (e) {
      console.error('Error updating rating:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
