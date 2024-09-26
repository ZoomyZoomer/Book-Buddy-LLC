import { connectToDatabase } from './utils/db'; // Adjust the path to your database connection utility
import Quest from './models/Quest'; // Adjust the path to your Quest model
import Inventory from './models/Inventory'; // Adjust the path to your Inventory model

const achievementMap = new Map([
    ['0', {id: '0', achievement_name: 'My Name is..', difficulty: 'Easy', icon: 'id-card', description: 'Register an account on BookBuddy', quantity: 1, reward: {file: 'file_5', file_id: '40'}}],
    ['1', {id: '1', achievement_name: 'File Farmer', difficulty: 'Easy', icon: 'sack', description: 'Collect 10 freshly dusted files', quantity: 10, reward: {file: 'file_4', file_id: '1'}}],
    ['2', {id: '2', achievement_name: 'Daily Cup of Joe', difficulty: 'Easy', icon: 'coffee_cup', description: 'Log in daily 3 times', quantity: 3 , reward: {item: 'coffee_cup', item_id: '0'}}],
    ['3', {id: '3', achievement_name: 'I Love Everything!', difficulty: 'Easy', icon: 'heart', description: 'Favorite atleast 5 books', quantity: 5, reward: {file: 'file_1', file_id: '0'}}],
    ['4', {id: '4', achievement_name: "Box o'Love", difficulty: 'Easy', icon: 'love_box', description: 'Open up 10 boxes / gifts', quantity: 10, reward: {item: 'package_icon', item_id: '11'}}],
    ['5', {id: '5', achievement_name: 'Message in a Bottle', difficulty: 'Easy', icon: 'miab', description: 'Send a feedback response', quantity: 1, reward: {item: 'coffee_cup', item_id: '0'}}],
    ['6', {id: '6', achievement_name: 'Lucky Penny', difficulty: 'Easy', icon: 'coin_penny', description: 'Purchase 5 items from the market', quantity: 5, reward: {item: 'coupon', item_id: '1'}}],
    ['7', {id: '7', achievement_name: 'A Little Taste', difficulty: 'Medium', icon: 'lollipop', description: 'Collect 4 different stickers', quantity: 4, reward: {file: 'file_3', file_id: '21'}}],
    ['8', {id: '8', achievement_name: "I'm Unstoppable!", difficulty: 'Medium', icon: 'calendar', description: 'Get a quest streak for 3 days', quantity: 3, reward: {file: 'file_2', file_id: '20'}}],
    ['9', {id: '9', achievement_name: 'King of the Corners', difficulty: 'Medium', icon: 'flag', description: 'Uncover all 4 corners of the warehouse', quantity: 4, reward: {file: 'file_3', file_id: '21'}}],
    ['10', {id: '10', achievement_name: 'An Open Book', difficulty: 'Medium', icon: 'open_book', description: 'Finish reading 6 books', quantity: 6, reward: {item: 'package_icon', item_id: '11'}}],
    ['11', {id: '11', achievement_name: 'The Big Bucks', difficulty: 'Medium', icon: 'big_bucks', description: 'Purchase 15 items from the market', quantity: 15, reward: {item: 'coupon', item_id: '1'}}],
    ['12', {id: '12', achievement_name: 'Hold My Bookmark', difficulty: 'Hard', icon: 'book_stack', description: 'Finish reading 14 books', quantity: 14, reward: {file: 'file_5', file_id: '40'}}],
    ['13', {id: '13', achievement_name: 'A Piece of Cake.. Literally', difficulty: 'Hard', icon: 'cake', description: 'Collect 8 different stickers', quantity: 8, reward: {file: 'file_5', file_id: '40'}}],
    ['14', {id: '14', achievement_name: 'I See it All!', difficulty: 'Hard', icon: 'map', description: 'Explore the entire warehouse', quantity: 1, reward: {file: 'file_5', file_id: '40'}}],
    ['15', {id: '15', achievement_name: 'Put it on My Card', difficulty: 'Hard', icon: 'wallet', description: 'Have 1000+ coins in your inventory', quantity: 1000, reward: {file: 'file_5', file_id: '40'}}],
    ['16', {id: '16', achievement_name: 'The Whole Pie!.. Cake', difficulty: 'Very Hard', icon: 'full-cake', description: 'Collect all 12 different stickers', quantity: 12, reward: {file: 'file_5', file_id: '40'}}]
])

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { username } = req.query;

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ message: 'Missing username' });
        }

        try {
            // Connect to the database
            await connectToDatabase();

            const quest = await Quest.findOne({ username: username });
            const inventory = await Inventory.findOne({ username: username });

            // Check if both quest and inventory exist
            if (!quest || !inventory) {
                return res.status(404).json({ message: 'Quest or inventory not found' });
            }

            // Update achievements
            const achievementIds = ['7', '13', '16'];

            achievementIds.forEach(id => {
                const achievement = quest.active_achievements.find(ach => ach.id === id);

                // Update or add achievement
                if (achievement) {
                    achievement.quantity = inventory.stickers_seen.length;
                } else {
                    quest.active_achievements.push({ id: id, quantity: inventory.stickers_seen.length });
                }
            });

            await quest.save();

            const completedList = quest.active_achievements.filter(ach => ach.quantity >= achievementMap.get(ach.id).quantity && ach.claimed);
            const completedList_final = completedList.map(ach => achievementMap.get(ach.id));

            const activeList_final = quest.active_achievements
                .filter(ach => !completedList.includes(ach))
                .map(ach => achievementMap.get(ach.id));

            const inactiveList = [...achievementMap.values()].filter(ach => !quest.active_achievements.find(achieve => achieve.id === ach.id));

            const clientList = quest.active_achievements.filter(ach => !ach.claimed);
            const numToClaim = quest.active_achievements.filter(ach => !ach.claimed && ach.quantity >= achievementMap.get(ach.id).quantity);

            res.status(200).json([
                [...activeList_final, ...inactiveList],
                [...clientList],
                [...completedList_final],
                numToClaim.length
            ]);
        } catch (e) {
            console.error('Error fetching achievements:', e);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: 'Method not allowed' });
    }
}
