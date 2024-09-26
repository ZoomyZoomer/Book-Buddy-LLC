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

const purchaseMap = new Map([
    ['14', {id: '14', item_name: 'Sticker Basket I', stock: 5, img: 'basket', type: 'Loot', use: 'Open it from your Filing Cabinet for a guaranteed randomly chosen sticker!', desc: 'A random sticker fresh off the shelves!', cost: {coins: false, dollar: true, amount: '$1.99'}}],
    ['15', {id: '15', item_name: 'Sticker Basket II', stock: 5, img: 'basket2', type: 'Loot', use: 'Open it from your Filing Cabinet for a guaranteed sticker of your choice!', desc: 'Handpick a sticker to add to your collection', cost: {coins: false, dollar: true, amount: '$3.99'}}]
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

      const itemsArray = [];

      // Populate itemsArray based on the inventory's collectables
      inventory.collectables.forEach(item => {
        if (marketMapSmall.get(item.id)) {
          itemsArray.push({ ...marketMapSmall.get(item.id), quantity: item.quantity });
        } else if (marketMapLarge.get(item.id)) {
          itemsArray.push({ ...marketMapLarge.get(item.id), quantity: item.quantity });
        } else if (purchaseMap.get(item.id)) {
          itemsArray.push({ ...purchaseMap.get(item.id), quantity: item.quantity });
        }
      });

      // Respond with the gathered data
      res.status(200).json(itemsArray);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
