import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model
import Quest from './models/Quests'; // Adjust the path to your Quest model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, index, filter, filterQuery } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's bookshelf
      const shelf = await Bookshelf.findOne({ username: username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      let fillArr = shelf.total_entries;

      if (filter === 'pages') {
        fillArr = fillArr.sort((a, b) => b.pages_added - a.pages_added);
      } else if (filter === 'recent') {
        fillArr = fillArr.reverse();
      } else if (filter === 'title') {
        fillArr = fillArr.sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          }
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
          }
          return 0;
        });
      }

      if (filterQuery) {
        // Replace + with spaces in filterQuery
        const query = filterQuery.replace(/\+/g, ' ').toLowerCase();
        fillArr = fillArr.filter(entry => entry.title.toLowerCase().includes(query));
      }

      // Ensure fillArr length is a multiple of 3 by adding null elements if needed
      while (fillArr.length % 3 !== 0) {
        fillArr.push('none');
      }

      // Fetch the user's quest information
      const quest = await Quest.findOne({ username: username });
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }

      const now = new Date();

      // If a new day has started, reset streak-related data
      if ((now >= quest.daily_quest_time) && !quest.streakTime) {
        // Check if streak was not completed yesterday
        if (!shelf.streak_today) {
          shelf.streak = 0;
          await shelf.save();
        }

        shelf.streak_today = false;
        shelf.streak_claimed = false;
        await shelf.save();

        // Set the next daily quest time to midnight tomorrow
        if (quest.questTime) {
          const midnightTomorrow = new Date(now);
          midnightTomorrow.setDate(now.getDate() + 1);
          midnightTomorrow.setHours(0, 0, 0, 0);
          quest.daily_quest_time = midnightTomorrow;
          quest.streakTime = false;
          quest.questTime = false;
        } else {
          quest.streakTime = true;
        }

        await quest.save();
      }

      // Send the response with the fetched data
      res.status(200).json([
        fillArr,
        fillArr.length,
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
