import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { volume_id, tab_name, username } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Remove the book with the given volume_id from the specified tab
      await Bookshelf.updateOne(
        { username, 'tabs.tab_name': tab_name },
        { $pull: { 'tabs.$.books': { volume_id } } }
      );

      // Remove the volume_id from the last_read array in the tab
      await Bookshelf.updateOne(
        { username, 'tabs.tab_name': tab_name },
        { $pull: { 'tabs.$.last_read': volume_id } }
      );

      res.status(200).json({ message: "Book successfully deleted" });
      
    } catch (err) {
      console.error('Error deleting book:', err);
      res.status(500).json({ message: "Could not delete book", error: err });
    }
    
  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
