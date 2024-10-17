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
                    const monthsIncluded = new Set();  // To track unique months
                    
                    // Month abbreviations
                    const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    // Get the most recent date (last element of array)
                    const mostRecentDate = dates[dates.length - 1];
                    const mostRecentDayOfWeek = getDayOfWeek(mostRecentDate); // Get day of the week

                    // Create a Set of stringified date values for quick lookup
                    const dateSet = new Set(dates.map(date => date.toDateString()));

                    // Track if we have encountered the first '1' and last '1' for marking
                    let firstMarkedDateInWeek = false;
                    let lastMarkedDay = -1; // Will track the last day index of 1 in the week

                    // Fill the current week, track the months encountered
                    const currentWeek = [];
                    for (let i = -mostRecentDayOfWeek; i <= 6 - mostRecentDayOfWeek; i++) {
                        const currentDay = new Date(mostRecentDate);
                        currentDay.setDate(mostRecentDate.getDate() + i);

                        // Track the month
                        monthsIncluded.add(currentDay.getMonth());

                        const isStreakDate = dateSet.has(currentDay.toDateString());

                        if (isStreakDate) {
                            currentWeek.push(1);  // Mark the day as 1 if it matches a streak date
                            firstMarkedDateInWeek = true;
                            lastMarkedDay = i;  // Update the last streak date
                        } else {
                            currentWeek.push(0);  // Fill unmarked days as 0 for now
                        }
                    }

                    // Now update the current week array:
                    for (let i = -mostRecentDayOfWeek; i <= 6 - mostRecentDayOfWeek; i++) {
                        if (i > lastMarkedDay) {
                            currentWeek[i + mostRecentDayOfWeek] = 5;  // Days after last 1 in the current week marked as 5
                        } else if (i > -mostRecentDayOfWeek && currentWeek[i + mostRecentDayOfWeek] === 0 && firstMarkedDateInWeek) {
                            currentWeek[i + mostRecentDayOfWeek] = 4;  // Days after first 1 and before last marked as 4
                        }
                    }

                    dateMatrix.push(currentWeek);

                    // Now go backwards in time to fill the remaining weeks and track months
                    let currentDate = new Date(mostRecentDate);
                    currentDate.setDate(currentDate.getDate() - (mostRecentDayOfWeek + 1)); // Go to the previous Sunday

                    for (let week = 1; week < weeks; week++) {
                        const weekArray = [];
                        let firstMarkedDayInWeek = false;
                        let lastMarkedDayInWeek = -1;

                        for (let day = 0; day < 7; day++) {
                            const currentDay = new Date(currentDate);
                            currentDay.setDate(currentDate.getDate() - day);

                            // Track the month
                            monthsIncluded.add(currentDay.getMonth());

                            const isStreakDate = dateSet.has(currentDay.toDateString());

                            if (isStreakDate) {
                                weekArray.unshift(1);  // Mark as 1 for streak dates
                                firstMarkedDayInWeek = true;
                                lastMarkedDayInWeek = day;  // Track the last marked day
                            } else {
                                weekArray.unshift(0);  // Initially mark as 0
                            }
                        }

                        // After filling the week, update the 0s to either 4 or 2 as per the rules
                        for (let day = 0; day < 7; day++) {
                            if (day > lastMarkedDayInWeek) {
                                weekArray[day] = 2;  // Mark days after the last 1 with 2 in past weeks
                            } else if (day > 0 && weekArray[day] === 0 && firstMarkedDayInWeek) {
                                weekArray[day] = 4;  // Mark days between the first and last 1 as 4
                            }
                        }

                        dateMatrix.push(weekArray);
                        currentDate.setDate(currentDate.getDate() - 7); // Move back by a full week
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
