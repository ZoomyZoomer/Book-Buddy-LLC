import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model
import Quest from './models/Quests'; // Adjust the path to your Quest model
import Inventory from './models/Inventory'; // Adjust the path to your Inventory model

const file_items = new Map([
    ['File', '"A mysterious file: Handle with care—could be a game changer or just more paperwork."'],
    ['Certificate', '"A certificate: Proof that you’ve mastered something—at least on paper!"'],
    ['Love Letter', '"A love letter: More powerful than any spell, but handle with care—hearts are fragile!"']
  ]);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, tab_name, volume_id, pages_added, total_pages_read, title } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Fetch tab and book
      const tab = shelf.tabs.find((tab) => tab.tab_name === tab_name);
      if (!tab) {
        return res.status(404).json({ message: 'Tab not found' });
      }
      const book = tab.books.find((book) => book.volume_id === volume_id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      if (pages_added <= 0) {
        return res.status(400).json({ message: 'Invalid number of pages' });
      }

      // Update tab's last read
      const lastReadIndex = tab.last_read.indexOf(book.volume_id);
      if (lastReadIndex !== -1) {
        tab.last_read.splice(lastReadIndex, 1);
      }
      tab.last_read.push(book.volume_id);

      // Update quest if applicable
      const quest = await Quest.findOne({ username });
      const relevant_quest = quest.active_quests.find((quest) => quest.id === '0');
      if (relevant_quest) {
        relevant_quest.quantity_achieved = Math.min(relevant_quest.quantity_achieved + pages_added, 50);
        await quest.save();
      }

      // Update book's pages read
      book.pages_read = total_pages_read;

      // Fetch inventory
      const inventory = await Inventory.findOne({ username });
      const item_set = inventory.items.find((set) => set.item_set_id === book.icon_set);

      // Prepare the date
      const now = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const month = monthNames[now.getMonth()];
      const day = String(now.getDate()).padStart(2, '0');
      const year = now.getFullYear();

      // Check if the last entry was made today and update it if so
      if (book.page_entries.length > 0) {
        const lastEntry = book.page_entries[book.page_entries.length - 1];
        if (lastEntry.date.month === month && lastEntry.date.day === day && lastEntry.date.year === year) {
          lastEntry.pages_added += pages_added;
          lastEntry.new_page_total += pages_added;

          const relatedEntry = shelf.total_entries.find(
            (entry) => entry.volume_id === volume_id && entry.date.month === month && entry.date.day === day && entry.date.year === year
          );
          relatedEntry.pages_added += pages_added;
          relatedEntry.new_page_total += pages_added;

          await shelf.save();
          return res.status(201).json({ message: 'Entry successfully combined and recorded' });
        }
      }

      // Determine entry icon, rarity, etc.
      let icon = `${book.icon_set}_1`;
      let rarity = 'Common';
      let value = 10;
      let display = shelf.settings.entry_default_icon;
      let tier = 'I';
      let desc = '"A mysterious file: Handle with care—could be a game changer or just more paperwork."';

      if (book.page_entries.length > 0) {
        const lastIcon = book.page_entries[book.page_entries.length - 1].icon.name;
        if (lastIcon === `${book.icon_set}_1`) {
          icon = `${book.icon_set}_2`;
          rarity = 'Rare';
          value = 20;
          display = 'Certificate';
          tier = 'II';
          desc = file_items['Certificate'];
        } else if (lastIcon === `${book.icon_set}_2` || lastIcon === `${book.icon_set}_3`) {
          icon = `${book.icon_set}_3`;
          rarity = 'Epic';
          value = 40;
          display = 'Love Letter';
          tier = 'III';
          desc = file_items['Love Letter'];
        }
      }

      // Update item quantity in inventory
      const item = item_set.item_set.find((set) => set.item === display);
      item.quantity += 1;
      await inventory.save();

      // Determine the streak and add the entry
      let streak = 0;
      let prevDates = [];
      if (book.page_entries.length > 0) {
        streak = book.page_entries[book.page_entries.length - 1].streak.days + 1;
        prevDates = book.page_entries[book.page_entries.length - 1].streak.dates;
      }

      // Ensure the streak flag is updated
      if (!shelf.streak_today) {
        shelf.streak_today = true;
      }

      // Create new entries for the book and total_entries
      const newEntry = {
        volume_id,
        title,
        pages_added: Number(pages_added),
        new_page_total: Number(total_pages_read),
        date: { month, day, year },
        icon: { name: icon, display, tier, rarity, value, desc },
        streak: { days: streak, dates: [`${month} ${day}`, ...prevDates] },
      };
      book.page_entries.push(newEntry);
      shelf.total_entries.push(newEntry);

      // Save the updated bookshelf
      await shelf.save();

      return res.status(201).json({ message: 'Entry successfully recorded' });

    } catch (e) {
      console.error('Error recording entry:', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
