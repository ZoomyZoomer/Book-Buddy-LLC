import { connectToDatabase } from './utils/db';
import Bookshelf from './models/Bookshelf';

export default async function handler(req, res) {

    const { username, volume_id } = req.body;

    try {

        await connectToDatabase();

        const shelf = await Bookshelf.findOne({ username });
        if (!shelf) {
            return res.status(404).json({ message: 'Bookshelf not found' });
        }

        const tab = shelf.tabs.find((tab) => tab.tab_name === 'Favorites');
        if (!tab) {
            return res.status(404).json({ message: 'Tab not found' });
        }
        const book = tab.books.find((book) => book.volume_id === volume_id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.reward_claimed = true;
        
        const rel_popup = shelf.emoji_popups.find((popup) => popup.id === 2);
        if (rel_popup){
            rel_popup.show = true;
            rel_popup.time = new Date();
        } else {
            shelf.emoji_popups.push({num_used: 0, claimed_today: false, show: true, time: new Date(), id: 2});
        }

        await shelf.save();

        return res.status(200).json({message: 'Book has been claimed'});
        

    } catch(e) {
        console.error('Error recording entry:', e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}