import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Bookshelf from './models/Bookshelf'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, sticker, volumeId } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's bookshelf
      const shelf = await Bookshelf.findOne({ username: username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Find the 'Favorites' tab and the specific book
      const tab = shelf.tabs.find(tab => tab.tab_name === 'Favorites');
      if (!tab) {
        return res.status(404).json({ message: 'Favorites tab not found' });
      }

      const rel_book = tab.books.find(booky => booky.volume_id === volumeId);
      if (!rel_book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const rel_stick = rel_book.active_stickers.find(stickery => stickery.location === sticker.location);

      if (!rel_stick) {
        // If the sticker is not already in use, add it
        rel_book.active_stickers.push(sticker);
        await shelf.save();
        return res.status(200).json({ message: 'Sticker successfully in use' });
      } else {
        // If the sticker is already in use, remove it
        const index = rel_book.active_stickers.findIndex(obj => obj.sticker_id === sticker.sticker_id);
        if (index !== -1) {
          rel_book.active_stickers.splice(index, 1);
          await shelf.save();
          return res.status(200).json({ message: 'Sticker successfully removed' });
        } else {
          return res.status(400).json({ message: 'Location already in use' });
        }
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
