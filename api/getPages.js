import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { volume_id, tab_name, username } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Find the relevant tab
      const tab = shelf.tabs.find((tab) => tab.tab_name === tab_name);
      if (!tab) {
        return res.status(404).json({ message: 'Requested tab not found' });
      }

      // Find the book in the tab
      const book = tab.books.find((book) => book.volume_id === volume_id);
      if (!book) {
        return res.status(404).json({ message: 'Requested book not found' });
      }

      // Respond with pages read and total pages
      return res.status(200).json([book.pages_read, book.total_pages]);

    } catch (e) {
      console.error('Error fetching pages:', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
