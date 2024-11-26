import User from './models/User';
import Bookshelf from './models/Bookshelf';
import Inventory from './models/Inventory';
import Quest from './models/Quests';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './utils/db';

const colorsCollection = ["#FFA9A9", "#A9D1FF", "#C6A9FF", "#F3A9FF", "#FFE7A9", "#A9FFE0"];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, email } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ error: "Username or email already exists" });
      }

      // Create new user
      const userDoc = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 10), // Adjusted salt rounds for bcrypt
      });

      // Create associated documents
      await Bookshelf.create({
        username,
        tabs: [],
        genre_colors: [],
        color_collection: colorsCollection,
        default_color: '#FFA9D5',
        settings: {
          bookBot_intro: true,
          entry_default_icon: "File",
        },
      });

      await Inventory.create({
        username,
        items: [{
          item_set_id: 'file',
          item_set: [
            { item: "File", max: 5 },
            { item: "Certificate", max: 4 },
            { item: "Love Letter", max: 3 },
          ],
        }],
        warehouse_grid: [
          [0, 1, 9, 2, 3, 3, 2],
          [1, 1, 2, 2, 3, 2, 9],
          [2, 1, 3, 3, 1, 2, 1],
          [3, 1, 2, 2, 2, 1, 2],
          [9, 1, 1, 3, 3, 1, 8],
        ],
        stickers_seen: ["0", "2", "3", "4"],
        currency:{
          coins: 500,
          xp: 0,
        },
        collectables: [{id: "14", quantity: 1}, {id: "9", quantity: 3}],
        files_seen: ["1", "21"],
        files: [{file_id: "1", quantity: 1}, {file_id: "21", quantity: 2}]
      });

      await Quest.create({
        username,
        active_quests: [],
        active_achievements: [{ id: '0', quantity: 1 }],
      });

      // Return the newly created user document
      res.status(201).json(userDoc);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Registration failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
