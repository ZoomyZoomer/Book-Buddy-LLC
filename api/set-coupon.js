import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Check if a coupon is already active
      if (inventory.active_coupon) {
        return res.status(400).json({ message: "Coupon already active" });
      }

      // Check if user has a coupon in their inventory
      const coupon = inventory.collectables?.find(item => item.id === '1');
      if (!coupon || coupon.quantity < 1) {
        return res.status(409).json({ message: "Insufficient coupons" });
      }

      // Remove a coupon from inventory and activate it
      coupon.quantity -= 1;
      inventory.active_coupon = true;

      await inventory.save();

      res.status(200).json({ message: 'Coupon successfully activated' });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
