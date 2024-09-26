import { connectToDatabase } from './utils/db'; // Import your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

const marketMapSmall = new Map([
    ['0', {id: '0', item_name: 'Cold Brew', stock: 1, img: 'coffee_cup', type: 'Consumable', use: `Refreshes the top portion of the Rewards Market`, desc: 'It’s a lukewarm coffee at best', cost: {coins: true, dollar: false, file: null, amount: 150, discounted_amount: 100}}],
    ['1', {id: '1', item_name: 'Coupon', stock: 1, img: 'coupon', type: 'Consumable', use: 'Discounts the top portion of the Rewards Market', desc: `Coupons for sale? What's the point!?`, cost: {coins: true, dollar: false, file: null, amount: 200, discounted_amount: 125}}],
    ['2', {id: '2', item_name: 'Jar of Jam', stock: 1, img: 'jam', type: 'Consumable', use: "Instantly completes the 'dusting process' of a file", desc: "Just a jar.. of (probably) strawberry jam", cost: {coins: true, dollar: false, file: null, amount: 300, discounted_amount: 200}}]
])

const marketMapLarge = new Map([
    ['9', {id: '9', item_name: 'Warehouse Package', stock: 5, img: 'package_icon', type: 'Loot', use: 'Open it from your Filing Cabinet for a pleasant surprise', desc: 'A dusty, timeworn box with a label barely legible', cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 2, discounted_amount: 1}}],
    ['8', {id: '8', item_name: 'Neatly Wrapped Gift', stock: 3, img: 'present_icon', type: 'Loot', use: 'Open it from your Filing Cabinet for a chance at a sticker', desc: "Oh wow, now that's a neatly wrapped gift!", cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 4, discounted_amount: 3}}],
    ['7', {id: '7', item_name: 'Tiny Envelope', stock: 5, img: 'mail_icon', type: 'Loot', use: "Open it from your Filing Cabinet for a *tiny* reward", desc: "It doesn't get more tiny than a tiny envelope", cost: {coins: false, dollar: false, file: 'file_2', id: '20', amount: 2, discounted_amount: 1}}]
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
    const { username } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });

      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      const files = inventory.files_seen;

      // Retrieve unseen files
      let unseen_files = Array.from(fileMap.values()).filter(file => {
        return !files.includes(file.id);
      });

      // Retrieve seen files
      let seen_files = [];
      files.forEach(file => {
        seen_files.push(fileMap.get(file));
      });

      // Calculate total quantity of files
      let quantity = 0;
      inventory.files.forEach(file => quantity += file.quantity);

      // Retrieve unseen items from market maps
      let unseen_items = [];
      Array.from(marketMapSmall.values()).forEach(item => {
        if (!inventory.collectables.find(item2 => item2.id === item.id)) {
          unseen_items.push(item);
        }
      });

      Array.from(marketMapLarge.values()).forEach(item => {
        if (!inventory.collectables.find(item2 => item2.id === item.id)) {
          unseen_items.push(item);
        }
      });

      // Respond with the gathered data
      res.status(200).json([seen_files.reverse(), unseen_files.reverse(), quantity, unseen_items]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
