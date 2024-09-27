import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model
import Rating from './models/Ratings'; // Adjust the path to your Rating model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tab_name, rating, volume_id, book_name, username } = req.body;

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

      // Find or create a volume in the Rating collection
      let volume = await Rating.findOne({ volume_id });
      if (!volume) {
        volume = new Rating({
          book_name,
          volume_id,
          ratings: [{ username, rating_value: rating, date: new Date() }]
        });

        await volume.save();
        return res.status(201).json({ message: 'New volume entry successfully created' });
      }

      // Check if the user already rated the book, update or create a new rating
      const userRating = volume.ratings.find(rating => rating.username === username);
      if (!userRating) {
        volume.ratings.push({ username, rating_value: rating, date: new Date() });
      } else {
        userRating.rating_value = rating;
        userRating.date = new Date();
      }

      // Save the updated volume document
      await volume.save();

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
