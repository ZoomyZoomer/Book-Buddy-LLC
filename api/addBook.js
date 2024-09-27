import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model
import Quest from './models/Quests'; // Adjust the path to your Quest model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { volumeId, title, author, cover, genre, pages, tabName, username } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Check if the genre already exists
      const genreExists = shelf.genre_colors.some(gc => gc.genre === genre[0]);
      if (!genreExists) {
        const firstColor = shelf.color_collection.shift();
        shelf.genre_colors.push({
          genre: genre[0],
          color: firstColor !== undefined ? firstColor : shelf.default_color
        });
      }

      // Find or create the appropriate tab
      let tab = shelf.tabs.find(t => t.tab_name === tabName);
      if (!tab) {
        // If the tab doesn't exist, create a new tab and add the book
        shelf.tabs.push({
          tab_name: tabName,
          books: [
            {
              volume_id: volumeId,
              title,
              is_favorite: false,
              author,
              cover,
              genre: genre[0],
              rating: 0,
              pages_read: 0,
              total_pages: pages || 0,
              banner_items: null,
              reward_tiers_claimed: [false, false, false, false],
              icon_set: 'file'
            }
          ]
        });
      } else {
        // If the tab exists, add the book to the existing tab
        tab.books.push({
          volume_id: volumeId,
          title,
          is_favorite: false,
          author,
          cover,
          genre: genre[0],
          rating: 0,
          pages_read: 0,
          total_pages: pages || 0,
          banner_items: null,
          reward_tiers_claimed: [false, false, false, false],
          icon_set: 'file'
        });
      }

      // Update quest progress for Something New (id: 6)
      const quest = await Quest.findOne({ username });
      const relevant_quest = quest?.active_quests.find(q => q.id === '6');
      if (relevant_quest && relevant_quest.quantity_achieved < 1) {
        relevant_quest.quantity_achieved += 1;
        await quest.save();
      }

      // Save the updated shelf
      await shelf.save();

      // Respond with success
      res.status(201).json({ message: tab ? 'Book successfully added' : 'Tab created and book successfully added' });

    } catch (e) {
      console.error('Error adding book:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
