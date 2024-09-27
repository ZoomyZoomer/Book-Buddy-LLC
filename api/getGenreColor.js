import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, genre } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Find the genre object in the genre_colors array
      let genreObject = shelf.genre_colors.find(gc => gc.genre === genre);

      // If the genre is not found, return the default color
      if (!genreObject) {
        genreObject = { color: shelf.default_color };
      }

      // Respond with the color
      return res.status(200).json({ color: genreObject.color });

    } catch (e) {
      console.error('Error fetching genre color:', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
