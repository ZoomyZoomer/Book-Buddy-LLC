import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {

    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        // Connect to the database
        await connectToDatabase();

        // Find the bookshelf by username
        const shelf = await Bookshelf.findOne({ username: username });

        if (!shelf) {
            return res.status(404).json({ message: "Bookshelf not found" });
        }

        // Get the current date on the shelf
        let currDate = shelf.curr_day;
        let tempDate = new Date();

        // If curr_day is null or undefined, initialize it to the past
        if (currDate) {
            currDate.setHours(0, 0, 0, 0); // Reset time to midnight
        }

        tempDate.setHours(0, 0, 0, 0); // Reset current date time to midnight

        // Check if curr_day is not set or if tempDate (today) is later than currDate
        if (!currDate || tempDate > currDate) {
            if (!shelf.streak_claimed) {
                shelf.streak = 0;
            }
            shelf.streak_claimed = false;
            shelf.curr_day = new Date(); // Set curr_day to today
            await shelf.save(); // Save the changes
            res.status(200).json({ message: "New day successfully processed" });
        } else {
            res.status(200).json({ message: "Same day verified" });
        }

    } catch (e) {
        console.error("Error processing request:", e);
        res.status(500).json({ message: "Internal server error" });
    }
}
