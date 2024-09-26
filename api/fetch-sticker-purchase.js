import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, random, value } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // If sticker basket was purchased
      if (random == 1) {
        let relevant_stickers = [];

        for (let r = 0; r < value; r++) {
          for (let i = 0; i < stickerMap.size; i++) {
            if (!inventory.stickers_seen.includes(stickerMap.get(i.toString()).sticker_id)) {
              relevant_stickers.push(stickerMap.get(i.toString()));
              inventory.stickers_seen.push(stickerMap.get(i.toString()).sticker_id);

              const currentDate = new Date();
              const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

              const collect_sticker = inventory.sticker_collection.find(sticker => sticker.sticker_id == relevant_stickers[relevant_stickers.length - 1].sticker_id);
              if (collect_sticker) {
                collect_sticker.date_acquired = formattedDate;
              } else {
                inventory.sticker_collection.push({ sticker_id: relevant_stickers[relevant_stickers.length - 1].sticker_id, date_acquired: formattedDate });
              }

              if (random) {
                const stick = inventory.collectables.find(item => item.id === '14');
                if (!stick) {
                  return res.status(400).json({ message: 'Sticker collectable not found' });
                }
                stick.quantity -= 1;
              }

              await inventory.save();
              break;
            }
          }
        }

        return res.status(200).json(relevant_stickers);
      } else {
        const rel_item = inventory.collectables.find(item => item.id === '15');

        if (!rel_item) {
          return res.status(400).json({ message: 'Item not found' });
        }

        rel_item.quantity -= Number(value);

        const myStickers = inventory.selected_stickers.map(sticker => sticker.sticker);
        myStickers.forEach(sticker => inventory.stickers_seen.push(sticker.sticker_id));

        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

        myStickers.forEach(sticker => {
          const stick = inventory.sticker_collection.find(sti => sti.sticker_id === sticker.sticker_id);
          if (!stick) {
            inventory.sticker_collection.push({ sticker_id: sticker.sticker_id, date_acquired: formattedDate });
          } else {
            stick.date_acquired = formattedDate;
          }
        });

        await inventory.save();
        return res.status(200).json(myStickers);
      }

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
