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
    const { username } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      const unowned_stickers = [];

      // Check which stickers are unowned
      for (let i = 0; i < stickerMap.size; i++) {
        if (!inventory.stickers_seen.includes(stickerMap.get(i.toString()).sticker_id)) {
          unowned_stickers.push(stickerMap.get(i.toString()));
        }
      }

      return res.status(200).json(unowned_stickers);
      
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
