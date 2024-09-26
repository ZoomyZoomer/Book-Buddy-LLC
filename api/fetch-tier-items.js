import { connectToDatabase } from './utils/db'; // Import your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary
import Quest from './models/Quest'; // Adjust the path if necessary

const stickerMap = new Map([
    ['0', {sticker_name: 'dapper-bird', sticker_id: '0', location: 0, sticker_display: 'Dapper Bird', sticker_set: {set: 'Christmas', set_item_id: 0, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}}],
    ['1', {sticker_name: 'holly', sticker_id: '1', location: 1, sticker_display: 'Holly', sticker_set: {set: 'Christmas', set_item_id: 1, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}}],
    ['2', {sticker_name: 'eagle', sticker_id: '2', location: 0, sticker_display: 'Eagle', sticker_set: {set: 'Breeze', set_item_id: 0, unique_color_name: 'Chill Green', border_color: 'white'}}],
    ['3', {sticker_name: 'leaves', sticker_id: '3', location: 2, sticker_display: 'Island Leaves', sticker_set: {set: 'Breeze', set_item_id: 1, unique_color_name: 'Chill Green', border_color: 'white'}}],
    ['4', {sticker_name: 'nemo', sticker_id: '4', location: 1, sticker_display: 'Nemo', sticker_set: {set: 'Ocean', set_item_id: 0, unique_color_name: 'Sea Blue', border_color: 'white'}}],
    ['5', {sticker_name: 'crab', sticker_id: '5', location: 0, sticker_display: 'Crab', sticker_set: {set: 'Ocean', set_item_id: 1, unique_color_name: 'Sea Blue', border_color: 'white'}}],
    ['6', {sticker_name: 'spaceship', sticker_id: '6', location: 1, sticker_display: 'Spaceship', sticker_set: {set: 'Space', set_item_id: 0, unique_color_name: 'Space Dark Blue', border_color: 'white'}}],
    ['7', {sticker_name: 'planet', sticker_id: '7', location: 0, sticker_display: 'Planet', sticker_set: {set: 'Space', set_item_id: 1, unique_color_name: 'Space Dark Blue', border_color: 'white'}}],
    ['8', {sticker_name: 'blue-bird', sticker_id: '8', location: 0, sticker_display: 'Blue Bird', sticker_set: {set: 'Nature', set_item_id: 0, unique_color_name: 'Nature Green', border_color: 'white'}}],
    ['9', {sticker_name: 'caterpillar', sticker_id: '9', location: 1, sticker_display: 'Caterpillar', sticker_set: {set: 'Nature', set_item_id: 1, unique_color_name: 'Nature Green', border_color: 'white'}}],
    ['10', {sticker_name: 'pagoda', sticker_id: '10', location: 0, sticker_display: 'Temple', sticker_set: {set: 'Japan', set_item_id: 0, unique_color_name: 'Japan Pink', border_color: 'white'}}],
    ['11', {sticker_name: 'bonsai', sticker_id: '11', location: 1, sticker_display: 'Octo-Bonsai', sticker_set: {set: 'Japan', set_item_id: 1, unique_color_name: 'Japan Pink', border_color: 'white'}}],
])

const fileMap = new Map([
    ['0', {name: 'Spreadsheet', id: '0', value: 10, rarity: 'Common', display: 'file_1', desc: `"A mysterious file: Handle with care—could be a game changer or just more paperwork."`}],
    ['1', {name: 'Stat Sheet', id: '1', value: 12, rarity: 'Common', display: 'file_4', desc: `"Discover your milestones and metrics, neatly organized for your perusal."`}],
    ['20', {name: 'Certificate', id: '20', value: 28, rarity: 'Rare', display: 'file_2', desc: `"Proof that you’ve mastered something—at least on paper!"`}],
    ['21', {name: 'Love Letter', id: '21', value: 32, rarity: 'Rare', display: 'file_3', desc: `"More powerful than any spell, but handle with care—hearts are fragile!"`}],
    ['40', {name: 'Diploma', id: '40', value: 58, rarity: 'Epic', display: 'file_5', desc: `"A rare testament to your dedication and achievement, a symbol of hard-earned knowledge and success."`}]
])

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, itemNum, eatItem } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      const rand = Math.floor(Math.random() * 100) + 1;
      let rarity = 0;
      let item;
      let sticker = [];
      let coins = 0;
      let xp = 0;

      // Chance to win a sticker
      let stickChance = 1;
      if (itemNum === '9' || itemNum === '8' || itemNum === '7') {
        stickChance = itemNum === '9' ? 3 : itemNum === '8' ? 10 : 1;
        if (eatItem == 0) {
          const collectable = inventory.collectables.find(item => item.id == itemNum);
          if (collectable) {
            collectable.quantity -= 1;
          }
        }
      }

      const randomStick = Math.floor(Math.random() * 100) + 1;

      // Sticker is won
      if (stickChance >= randomStick && inventory.stickers_seen.length < stickerMap.size) {
        sticker = Array.from(stickerMap.values()).filter(stickery => 
          !inventory.stickers_seen.includes(stickery.sticker_id)
        );

        const randomStickArr = Math.floor(Math.random() * sticker.length);
        inventory.stickers_seen.push(sticker[randomStickArr].sticker_id);

        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

        const rel_sticker = inventory.sticker_collection.find(stickery => stickery.sticker_id === sticker[randomStickArr].sticker_id);
        if (!rel_sticker) {
          inventory.sticker_collection.push({ sticker_id: sticker[randomStickArr].sticker_id, date_acquired: formattedDate });
        } else {
          rel_sticker.date_acquired = formattedDate;
        }
        
        await inventory.save();
      }

      if (sticker.length === 0) {
        // Pick tier
        if (rand >= 95) {
          rarity = 40;
        } else if (rand >= 75) {
          rarity = 20;
        }

        if (rarity !== 40) {
          // Pick out item from rarity
          const rand = Math.floor(Math.random() * 2);
          item = fileMap.get((rarity + rand).toString());
        } else {
          item = fileMap.get(rarity.toString());
        }

        const fileItem = inventory.files.find(file => file.file_id === item.id);

        if (!fileItem) {
          inventory.files.push({ file_id: item.id, quantity: 1 });
        } else {
          fileItem.quantity += 1;
        }

        if (!inventory.files_seen.includes(item.id)) {
          inventory.files_seen.push(item.id);
        }
      }

      // Pick out number of coins
      const coinRand = Math.floor(Math.random() * 100) + 1;

      if (coinRand >= 85) {
        coins = Math.floor(Math.random() * 20) + 12;
      } else if (coinRand >= 50) {
        coins = Math.floor(Math.random() * 11) + 8;
      } else {
        coins = Math.floor(Math.random() * 7) + 4;
      }

      // Pick out number of xp
      const xpRand = Math.floor(Math.random() * 100) + 1;

      if (xpRand >= 85) {
        xp = Math.floor(Math.random() * 20) + 12;
      } else if (xpRand >= 50) {
        xp = Math.floor(Math.random() * 11) + 8;
      } else {
        xp = Math.floor(Math.random() * 7) + 4;
      }

      inventory.currency.coins += coins;
      inventory.currency.xp += xp;

      await inventory.save();

      // Update Box o'Love achievement (id: 4)
      const quest = await Quest.findOne({ username: username });
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }
      const achievement = quest.active_achievements.find(ach => ach.id === '4');

      // Already an active achievement (in progress)
      if (achievement) {
        achievement.quantity += 1;
      } else {
        quest.active_achievements.push({ id: '4', quantity: 1 });
      }

      await quest.save();

      res.status(200).json([sticker.length > 0 ? sticker[randomStickArr] : item, coins, xp]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
