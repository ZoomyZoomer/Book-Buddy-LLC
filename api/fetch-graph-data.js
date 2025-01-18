import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Bookshelf from './models/Bookshelf'; // Adjust the path if necessary

export default async function handler(req, res) {
    const { username } = req.query;

    try {
        
        await connectToDatabase();

        const shelf = await Bookshelf.findOne({ username: username });
        if (!shelf) {
            return res.status(404).json({ message: 'Bookshelf not found' });
        }

        const now = new Date();

        // Adjust to ensure 7 days includes today and ends on the same weekday of the previous week
        const pastSevenDaysStart = new Date();
        pastSevenDaysStart.setDate(now.getDate() - 6); // Start 6 days before today (inclusive of today)

        const pastSevenDaysEnd = new Date(); // Include today
        pastSevenDaysEnd.setDate(pastSevenDaysEnd.getDate()); // Adjust end to include today

        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const dates = shelf.dates;

        // Helper function to ensure all days of the week are included
        const fillMissingDays = (entries, startDate, endDate) => {
            const filledEntries = [];
            const dayMap = new Map(
                entries.map(entry => [entry.date.toISOString().split('T')[0], entry])
            );

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Abbreviated days

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const dateKey = date.toISOString().split('T')[0];
                const dayAbbr = dayNames[date.getDay()]; // Get the abbreviated day name

                if (dayMap.has(dateKey)) {
                    filledEntries.push({
                        timeframe: dayAbbr,
                        pages: dayMap.get(dateKey).pages,
                    });
                } else {
                    filledEntries.push({
                        timeframe: dayAbbr,
                        pages: 0,
                    });
                }
            }

            return filledEntries;
        };

        // Function to get the last 7 weeks and ensure the correct week labels
        const getLastSevenWeeks = (entries) => {
            const weeks = [];
            let currentDate = new Date(now);

            // Loop to create 7 weeks from the most recent week backwards
            for (let i = 0; i < 7; i++) {
                // Get the start of the current week (Sunday)
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Adjust to Sunday
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Get Saturday of the same week

                // Filter the entries to find the ones that belong to this week
                const weekEntries = entries.filter(entry => 
                    new Date(entry.date) >= startOfWeek && new Date(entry.date) <= endOfWeek
                );

                // Label the week by the starting date (e.g., "1/1")
                const weekStartFormatted = `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}`;

                weeks.push({
                    timeframe: weekStartFormatted,
                    entries: fillMissingDays(weekEntries, startOfWeek, endOfWeek),
                    pages: weekEntries.reduce((sum, entry) => sum + entry.pages, 0),
                });

                // Move to the previous week
                currentDate.setDate(currentDate.getDate() - 7);
            }

            return weeks.reverse(); // Ensure the weeks are in chronological order
        };

        // Get past 7 days, including today
        const pastSevenDays = fillMissingDays(
            dates.filter(
                entry =>
                    new Date(entry.date) >= pastSevenDaysStart &&
                    new Date(entry.date) <= pastSevenDaysEnd
            ),
            pastSevenDaysStart,
            pastSevenDaysEnd
        );

        // Get the last 7 weeks of the past month
        const pastMonth = getLastSevenWeeks(dates.filter(entry => entry.date >= oneYearAgo));

        // Get the last 7 months of the past year (no need for the fillMissingMonths function)
        const pastYear = [];
        let currentMonth = new Date(now);
        for (let i = 0; i < 7; i++) {
            const startOfMonth = new Date(currentMonth);
            startOfMonth.setDate(1); // Set to the first day of the month
            const monthEntries = dates.filter(entry => 
                new Date(entry.date).getMonth() === startOfMonth.getMonth() &&
                new Date(entry.date).getFullYear() === startOfMonth.getFullYear()
            );

            const monthLabel = startOfMonth.toLocaleDateString('en-US', { month: 'short' }); // Get the abbreviated month name

            pastYear.push({
                timeframe: monthLabel,
                entries: monthEntries,
                pages: monthEntries.reduce((sum, entry) => sum + entry.pages, 0),
            });

            currentMonth.setMonth(currentMonth.getMonth() - 1); // Move to the previous month
        }

        return res.status(200).json([
            pastSevenDays,
            pastMonth,
            pastYear.reverse(),
            shelf.goals_set
        ]);

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
}
