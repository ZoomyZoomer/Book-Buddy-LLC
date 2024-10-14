import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {

    if (req.method === 'GET') {

        const { username } = req.query;

        try {

            await connectToDatabase();

            let result = [];

            const shelf = await Bookshelf.findOne({ username: username });

            if (shelf.streak_dates.length > 0){
            // Convert the dates to a format we can compare
            const formattedDates = shelf.streak_dates.map(date => date.toISOString().split('T')[0]);

            // Get the most recent date (last element in the array)
            let mostRecentDate = new Date(formattedDates[formattedDates.length - 1]);

            // Create a 7x24 matrix
            const weeks = 24;
            const daysPerWeek = 7;
            result = new Array(weeks).fill(null).map(() => new Array(daysPerWeek).fill(0));

            // Iterate backwards through 70 days (10 weeks)
            for (let week = 0; week < weeks; week++) {
            for (let day = daysPerWeek - 1; day >= 0; day--) {
                // Format the current date as YYYY-MM-DD for comparison
                const formattedCurrentDate = mostRecentDate.toISOString().split('T')[0];

                // If the current date exists in the formattedDates array, set the value to 1
                if (formattedDates.includes(formattedCurrentDate)) {
                result[week][day] = 1;
                }

                // Go to the previous day
                mostRecentDate.setDate(mostRecentDate.getDate() - 1);
            }
            }
        }

            res.status(200).json([shelf.streak_claimed, shelf.streak, result]);

        } catch(e) {
        res.status(500).json({ error: 'Internal Server Error' })
        }

    } else {

        // Method not allowed
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: 'Method Not Allowed' });

    }
}