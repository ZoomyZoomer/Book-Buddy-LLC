import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary
import Quest from './models/Quests'; // Adjust the path if necessary
import Bookshelf from './models/Bookshelf';

const fileMap = new Map([
  ['file_1', {name: 'Spreadsheet', id: '0', value: 10, rarity: 'Common', display: 'file_1', desc: `"A mysterious file: Handle with care—could be a game changer or just more paperwork."`}],
  ['file_4', {name: 'Stat Sheet', id: '1', value: 12, rarity: 'Common', display: 'file_4', desc: `"Discover your milestones and metrics, neatly organized for your perusal."`}],
  ['file_2', {name: 'Certificate', id: '20', value: 28, rarity: 'Rare', display: 'file_2', desc: `"Proof that you’ve mastered something—at least on paper!"`}],
  ['file_3', {name: 'Love Letter', id: '21', value: 32, rarity: 'Rare', display: 'file_3', desc: `"More powerful than any spell, but handle with care—hearts are fragile!"`}],
  ['file_5', {name: 'Diploma', id: '40', value: 58, rarity: 'Epic', display: 'file_5', desc: `"A rare testament to your dedication and achievement, a symbol of hard-earned knowledge and success."`}]
])

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, index, notWarehouse, entry } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Remove the file from the grid

      if (!notWarehouse){
        inventory.warehouse_grid[index[0]][index[1]] = 0;
        inventory.markModified('warehouse_grid');
      }


      // Add new file to quantity
      const file = inventory.files.find(file => file.file_id === fileMap.get(entry.icon.name).id);
      if (file) {
        file.quantity += 1;
      }

      if (notWarehouse){

        const shelf = await Bookshelf.findOne({ username });

        const rel_entry = shelf.total_entries.find((ent) => ent._id == entry._id);
        rel_entry.is_claimed = true;

        await shelf.save();

      }

      // Update File Farmer achievement (id: 1)
      const quest = await Quest.findOne({ username: username });
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }

      const achievement = quest.active_achievements.find(ach => ach.id === '1');

      // Already an active achievement (in progress)
      if (achievement) {
        achievement.quantity += 1;
      } else {
        quest.active_achievements.push({ id: '1', quantity: 1 });
      }

      await quest.save();

      // Add to files_seen if it's new
      if (!inventory.files_seen.includes(fileMap.get(entry.icon.name).id)) {
        inventory.files_seen.push(fileMap.get(entry.icon.name).id);
      }

      // Update active file's index to indicate it has been claimed
      if (!notWarehouse) {
        const activeFile = inventory.active_files.find(file => 
          file.index.every((f, i) => f === index[i])
        );
        if (activeFile) {
          activeFile.index = [-1, -1];
        }
      }
      

      await inventory.save();

      // Check if Satisfying quest is present (id: 8)
      const relevant_quest = quest.active_quests.find(quest => quest.id === '8');
      if (relevant_quest) {
        if (relevant_quest.quantity_achieved < 1) {
          relevant_quest.quantity_achieved += 1;
        }
        await quest.save();
      }

      res.status(200).json({ message: 'File successfully claimed' });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
