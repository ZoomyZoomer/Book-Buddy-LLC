import { connectToDatabase } from './utils/db'; // Adjust the path to your database connection utility
import Inventory from './models/Inventory'; // Adjust the path to your Inventory model


const marketMapSmall = new Map([
    ['0', {id: '0', item_name: 'Cold Brew', stock: 1, img: 'coffee_cup', type: 'Consumable', use: `Refreshes the top portion of the Rewards Market`, desc: 'It’s a lukewarm coffee at best', cost: {coins: true, dollar: false, file: null, amount: 150, discounted_amount: 100}}],
    ['1', {id: '1', item_name: 'Coupon', stock: 1, img: 'coupon', type: 'Consumable', use: 'Discounts the top portion of the Rewards Market', desc: `Coupons for sale? What's the point!?`, cost: {coins: true, dollar: false, file: null, amount: 200, discounted_amount: 125}}],
    ['2', {id: '2', item_name: 'Jar of Jam', stock: 1, img: 'jam', type: 'Consumable', use: "Instantly completes the 'dusting process' of a file", desc: "Just a jar.. of (probably) strawberry jam", cost: {coins: true, dollar: false, file: null, amount: 300, discounted_amount: 200}}]
])

const marketMapLarge = new Map([
    ['9', {id: '9', item_name: 'Warehouse Package', stock: 5, img: 'package_icon', type: 'Loot', use: 'Open it from your Storage for a pleasant surprise', desc: 'A dusty, timeworn box with a label barely legible', cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 2, discounted_amount: 1}}],
    ['8', {id: '8', item_name: 'Neatly Wrapped Gift', stock: 3, img: 'present_icon', type: 'Loot', use: 'Open it from your Storage for a chance at a sticker', desc: "Oh wow, now that's a neatly wrapped gift!", cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 4, discounted_amount: 3}}],
    ['7', {id: '7', item_name: 'Tiny Envelope', stock: 5, img: 'mail_icon', type: 'Loot', use: "Open it from your storage for a *tiny* reward", desc: "It doesn't get more tiny than a tiny envelope", cost: {coins: false, dollar: false, file: 'file_2', id: '20', amount: 2, discounted_amount: 1}}]
])

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { username } = req.query;

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ message: 'Missing username' });
        }

        try {
            // Connect to the database
            await connectToDatabase();

            const inventory = await Inventory.findOne({ username: username });

            // Check if inventory exists
            if (!inventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }

            const numCoupons = inventory.collectables.find(item => item.id === '1')?.quantity || 0;
            const numCoffees = inventory.collectables.find(item => item.id === '0')?.quantity || 0;

            const now = new Date();

            // A new day has started
            if (now >= inventory.market_time) {
                const randomIntSmall = Math.floor(Math.random() * marketMapSmall.size);
                const smallMarket = marketMapSmall.get(randomIntSmall.toString());

                const randomIntLarge = Math.floor(Math.random() * marketMapLarge.size) + 7;
                const largeMarket = marketMapLarge.get(randomIntLarge.toString());

                inventory.market_small[0] = smallMarket;
                inventory.market_large[0] = largeMarket;

                // Update time
                const sixHoursAhead = new Date(now);
                sixHoursAhead.setHours(now.getHours() + 6);
                inventory.market_time = sixHoursAhead;

                await inventory.save();

                return res.status(200).json([
                    smallMarket,
                    largeMarket,
                    inventory.active_coupon,
                    numCoupons,
                    numCoffees,
                    sixHoursAhead,
                    inventory.stickers_seen.length,
                ]);
            } else {
                return res.status(200).json([
                    inventory.market_small[0],
                    inventory.market_large[0],
                    inventory.active_coupon,
                    numCoupons,
                    numCoffees,
                    inventory.market_time,
                    inventory.stickers_seen.length,
                ]);
            }
        } catch (e) {
            console.error('Error fetching market:', e);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
