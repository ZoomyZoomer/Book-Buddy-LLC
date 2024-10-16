import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
    if (req.method === 'GET') {

        const { username } = req.query;

        try {
            await connectToDatabase();

            let dateMatrix2 = [[], []];

            const shelf = await Bookshelf.findOne({ username: username });

            if (shelf && shelf.streak_dates.length > 0) {
                const streakDates = shelf.streak_dates.map(date => new Date(date));  // Convert to Date objects

                // Helper function to get day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
                const getDayOfWeek = (date) => date.getDay();

                // Function to generate a 7x30 array and return an array with unique month abbreviations
                const generateDateMatrixAndMonths = (dates, weeks) => {
                    const totalDays = weeks * 7;
                    const dateMatrix = [];
                    let currentWeek = [];
                    const monthsIncluded = new Set();  // To track unique months
                    
                    // Month abbreviations
                    const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    // Get the most recent date (last element of array)
                    const mostRecentDate = dates[dates.length - 1];
                    const mostRecentDayOfWeek = getDayOfWeek(mostRecentDate); // Get day of the week

                    // Create a Set of stringified date values for quick lookup
                    const dateSet = new Set(dates.map(date => date.toDateString()));

                    // Track if we have encountered the first '1' for marking 2
                    let firstMarkedDateInWeek = false;

                    // Fill the current week, track the months encountered
                    for (let i = -mostRecentDayOfWeek; i <= 6 - mostRecentDayOfWeek; i++) {
                        const currentDay = new Date(mostRecentDate);
                        currentDay.setDate(mostRecentDate.getDate() + i);

                        // Track the month
                        monthsIncluded.add(currentDay.getMonth());

                        const isStreakDate = dateSet.has(currentDay.toDateString());

                        if (isStreakDate) {
                            currentWeek.push(1);  // Mark the day as 1 if it matches a streak date
                            firstMarkedDateInWeek = true;  // Found the first date marked with 1
                        } else if (firstMarkedDateInWeek) {
                            currentWeek.push(2);  // Mark days ahead of the first `1` as 2
                        } else {
                            currentWeek.push(0);  // Days before the first marked date should remain 0
                        }
                    }

                    dateMatrix.push(currentWeek);

                    // Now go backwards in time to fill the remaining weeks and track months
                    let currentDate = new Date(mostRecentDate);
                    currentDate.setDate(currentDate.getDate() - (mostRecentDayOfWeek + 1)); // Go to the previous Sunday

                    for (let week = 1; week < weeks; week++) {
                        const weekArray = [];
                        for (let day = 0; day < 7; day++) {
                            const currentDay = new Date(currentDate);
                            currentDay.setDate(currentDate.getDate() - day);

                            // Track the month
                            monthsIncluded.add(currentDay.getMonth());

                            // Fill with 1 for matching streakDates, or 0 for empty spots
                            let dayValue = dateSet.has(currentDay.toDateString()) ? 1 : 0;
                            weekArray.unshift(dayValue);
                        }
                        dateMatrix.push(weekArray);
                        currentDate.setDate(currentDate.getDate() - 7); // Move back by a full week
                    }

                    // ** New Logic to fill 3 for remaining days after most recent date if not 1 **
                    // Iterate through the entire matrix and mark remaining days after streakDates[0]
                    const mostRecentDateInStreak = dates[0]; // streakDates[0] is the latest entered date
                    for (let week = 0; week < dateMatrix.length; week++) {
                        for (let day = 0; day < 7; day++) {
                            // Skip days that are already filled with 1
                            if (dateMatrix[week][day] !== 1) {
                                const currentDay = new Date(mostRecentDate);
                                currentDay.setDate(currentDay.getDate() - (week * 7 + day));

                                // If this day is ahead of streakDates[0], mark it as 3
                                if (currentDay > mostRecentDateInStreak) {
                                    dateMatrix[week][day] = 3;
                                }
                            }
                        }
                    }

                    // Convert month numbers to 3-letter month abbreviations
                    const monthArray = [...monthsIncluded].sort().map(monthIndex => monthAbbreviations[monthIndex]);

                    return [dateMatrix, monthArray];
                };

                // Generate a 7x30 array and get the array of unique month abbreviations
                dateMatrix2 = generateDateMatrixAndMonths(streakDates, 20); // Pass streakDates

            }

            res.status(200).json([shelf.streak_claimed, shelf.streak, [dateMatrix2[0].reverse(), dateMatrix2[1]]]);

        } catch (e) {
            console.error(e);  // Log the error for debugging
            res.status(500).json({ error: 'Internal Server Error' });
        }

    } else {
        // Method not allowed
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
