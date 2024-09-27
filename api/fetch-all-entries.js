import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model
import Quest from './models/Quests'; // Adjust the path to your Quest model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, index } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's bookshelf
      const shelf = await Bookshelf.findOne({ username: username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Reverse the total entries and slice the array as needed
      const reversedEntries = [...shelf.total_entries].reverse();
      const arr = reversedEntries.slice(index, parseInt(index) + 4).slice(0, 4);
      const fillArr = arr.length >= 4 ? arr : arr.concat(Array(4 - arr.length).fill(null));

      // Fetch the user's quest information
      const quest = await Quest.findOne({ username: username });
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }

      const now = new Date();

      // If a new day has started, reset streak-related data
      if (now >= quest.daily_quest_time) {
        // Check if streak was not completed yesterday
        if (!shelf.streak_today) {
          shelf.streak = 0;
          await shelf.save();
        }

        shelf.streak_today = false;
        shelf.streak_claimed = false;
        await shelf.save();

        // Set the next daily quest time to midnight tomorrow
        const midnightTomorrow = new Date(now);
        midnightTomorrow.setDate(now.getDate() + 1);
        midnightTomorrow.setHours(0, 0, 0, 0);
        quest.daily_quest_time = midnightTomorrow;

        await quest.save();
      }

      // Send the response with the fetched data
      res.status(200).json([
        fillArr,
        shelf.total_entries.length,
        { streak: shelf.streak, is_claimed: shelf.streak_claimed, today: shelf.streak_today }
      ]);

    } catch (e) {
      console.error('Error fetching entries:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Handle method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
