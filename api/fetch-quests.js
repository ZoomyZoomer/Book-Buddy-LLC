import { connectToDatabase } from './utils/db'; // Adjust the path to your database connection utility
import Quest from './models/Quests'; // Adjust the path to your Quest model
import Inventory from './models/Inventory'; // Adjust the path to your Inventory model

const questMap = new Map([
    ['0', {id: '0', title: 'A New Day', quest: 'Read 50 pages', quantity_required: 50}],
    ['1', {id: '1', title: 'More Dust', quest: 'Place a file in your warehouse', quantity_required: 1}],
    ['2', {id: '2', title: 'Level Up', quest: 'Collect 25 experience points', quantity_required: 25}],
    ['3', {id: '3', title: 'Morning Coffee', quest: 'Drink a cold brew', quantity_required: 1}],
    ['4', {id: '4', title: 'Merchant', quest: 'Buy something from the Market', quantity_required: 1}],
    ['5', {id: '5', title: 'Good Morning', quest: 'Log In', quantity_required: 1}],
    ['6', {id: '6', title: 'Something New', quest: 'Add a book to your library', quantity_required: 1}],
    ['7', {id: '7', title: "That's Adhesive", quest: 'Apply a sticker to a book', quantity_required: 1}],
    ['8', {id: '8', title: 'Satisfying', quest: 'Pickup a ready file in your warehouse', quantity_required: 1}],
    ['9', {id: '9', title: 'Pretty Penny', quest: 'Profit 25 coins today', quantity_required: 25}]
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

            // Check if the quest and inventory exist
            if (!quest || !inventory) {
                return res.status(404).json({ message: 'Quest or Inventory not found' });
            }

            // Decide whether to fetch active quests or get new ones if it's a new day
            const now = new Date();
            let newQuests = [];

            // New day has started
            if ((now >= quest.daily_quest_time) && !quest.questTime) {
                for (let i = 0; i < 3; i++) {
                    let randomQuest = questMap.get((Math.floor(Math.random() * questMap.size)).toString());

                    if (!newQuests.includes(randomQuest)) {
                        newQuests.push(randomQuest);
                    } else {
                        i--;
                    }
                }

                // Check if all quests from the previous were completed
                if (quest.active_quests.length !== 0) {
                    if (!quest.active_quests[0].marked_complete || !quest.active_quests[1].marked_complete || !quest.active_quests[2].marked_complete) {
                        quest.streak = 0;
                    }
                }

                quest.active_quests = [
                    { id: newQuests[0].id, held_xp: inventory.currency.xp, held_coins: inventory.currency.coins },
                    { id: newQuests[1].id, held_xp: inventory.currency.xp, held_coins: inventory.currency.coins },
                    { id: newQuests[2].id, held_xp: inventory.currency.xp, held_coins: inventory.currency.coins }
                ];

                // Update Daily Cup of Joe achievement (id: 2)
                const achievement = quest.active_achievements.find(ach => ach.id === '2');

                if (achievement) {
                    achievement.quantity += 1;
                } else {
                    quest.active_achievements.push({ id: '2', quantity: 1 });
                }

                await quest.save();

                // Check if Good Morning quest is present (id: 5)
                const relevantQuest = quest.active_quests.find(q => q.id === '5');
                if (relevantQuest) {
                    if (!relevantQuest.quantity_achieved >= 1) {
                        relevantQuest.quantity_achieved += 1;
                    }
                    await quest.save();
                }

                // Update time
                if (quest.streakTime){
                    const midnightTomorrow = new Date(now);
                    midnightTomorrow.setDate(now.getDate() + 1);
                    midnightTomorrow.setHours(0, 0, 0, 0);
                    quest.daily_quest_time = midnightTomorrow;
                    quest.streakTime = false;
                    quest.questTime = false;
                } else {
                    quest.questTime = true;
                }

                await quest.save();

                return res.status(200).json([newQuests, quest.active_quests, quest.streak, midnightTomorrow]);
            } else {
                // Update existing quest achievements based on currency
                quest.active_quests.forEach(q => {
                    if (q.id === '2') {
                        q.quantity_achieved = Math.min(25, inventory.currency.xp - q.held_xp);
                    }
                });
                quest.active_quests.forEach(q => {
                    if (q.id === '9') {
                        q.quantity_achieved = Math.min(25, inventory.currency.coins - q.held_coins);
                    }
                });

                await quest.save();

                quest.active_quests.forEach(q => newQuests.push(questMap.get(q.id)));

                return res.status(200).json([newQuests, quest.active_quests, quest.streak, quest.daily_quest_time]);
            }
        } catch (e) {
            console.error('Error fetching quests:', e);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
