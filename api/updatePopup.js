import Bookshelf from './models/Bookshelf';
import { connectToDatabase } from './utils/db';

export default async function handler(req, res) {

    const { username, id } = req.body;

    try {

        await connectToDatabase();

        const shelf = await Bookshelf.findOne({ username });
        if (!shelf) {
            return res.status(404).json({ message: 'Bookshelf not found' });
        }

        const emojiPopup = shelf.emoji_popups.find((popup) => popup.id === id);
        if (emojiPopup){

            emojiPopup.show = false;
            emojiPopup.num_used += 1;
            emojiPopup.claimed_today = true;
            await shelf.save();

        } else {
            return res.status(404).json({ message: 'Popup not found' });
        }

        return res.status(200).json({message: 'Popup deactivated'});

    } catch(e) {
        console.error(e);
        res.status(400).json({ error: 'Registration failed' });
    }

}