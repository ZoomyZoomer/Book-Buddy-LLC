import { connectToDatabase } from './utils/db'; // Import your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

const stickerMap = new Map([
    ['0', {sticker_name: 'dapper-bird', sticker_id: '0', location: 0, sticker_display: 'Darwin the Dapper Bird', sticker_set: {set: 'Winter Time', set_item_id: 0, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}}],
    ['1', {sticker_name: 'holly', sticker_id: '1', location: 1, sticker_display: 'Holly Hank', sticker_set: {set: 'Winter Time', set_item_id: 1, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}}],
    ['2', {sticker_name: 'eagle', sticker_id: '2', location: 0, sticker_display: 'Eagle Edward', sticker_set: {set: 'Cool Vibes', set_item_id: 0, unique_color_name: 'Chill Green', border_color: 'white'}}],
    ['3', {sticker_name: 'leaves', sticker_id: '3', location: 2, sticker_display: 'Leafy Larry', sticker_set: {set: 'Cool Vibes', set_item_id: 1, unique_color_name: 'Chill Green', border_color: 'white'}}],
    ['4', {sticker_name: 'nemo', sticker_id: '4', location: 1, sticker_display: 'Fishy Frank', sticker_set: {set: 'Underwater', set_item_id: 0, unique_color_name: 'Sea Blue', border_color: 'white'}}],
    ['5', {sticker_name: 'crab', sticker_id: '5', location: 0, sticker_display: 'Crabby Carl', sticker_set: {set: 'Underwater', set_item_id: 1, unique_color_name: 'Sea Blue', border_color: 'white'}}],
    ['6', {sticker_name: 'spaceship', sticker_id: '6', location: 1, sticker_display: 'Rocket Ricky', sticker_set: {set: 'Outer Space', set_item_id: 0, unique_color_name: 'Space Dark Blue', border_color: 'white'}}],
    ['7', {sticker_name: 'planet', sticker_id: '7', location: 0, sticker_display: 'Planet Phil', sticker_set: {set: 'Outer Space', set_item_id: 1, unique_color_name: 'Space Dark Blue', border_color: 'white'}}],
    ['8', {sticker_name: 'blue-bird', sticker_id: '8', location: 0, sticker_display: 'Blue Bird', sticker_set: {set: 'Nature', set_item_id: 0, unique_color_name: 'Nature Green', border_color: 'white'}}],
    ['9', {sticker_name: 'caterpillar', sticker_id: '9', location: 1, sticker_display: 'Caterpillar', sticker_set: {set: 'Nature', set_item_id: 1, unique_color_name: 'Nature Green', border_color: 'white'}}],
    ['10', {sticker_name: 'crown', sticker_id: '10', location: 0, sticker_display: 'Crown', sticker_set: {set: 'Chess', set_item_id: 0, unique_color_name: 'Chess White', border_color: 'white'}}],
    ['11', {sticker_name: 'bishop', sticker_id: '11', location: 1, sticker_display: 'Bishop', sticker_set: {set: 'Chess', set_item_id: 1, unique_color_name: 'Chess White', border_color: 'white'}}],
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

      // Retrieve owned stickers
      let owned_stickers = [];
      inventory.stickers_seen.forEach(sticker => owned_stickers.push(stickerMap.get(sticker)));

      // Retrieve unseen stickers
      let unseen_stickers = Array.from(stickerMap.values()).filter(sticker => {
        return !inventory.stickers_seen.includes(sticker.sticker_id);
      });

      // Respond with owned and unseen stickers
      res.status(200).json([owned_stickers, unseen_stickers]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
