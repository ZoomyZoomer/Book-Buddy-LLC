import { connectToDatabase } from './utils/db'; // Adjust the path to your database connection utility
import Quest from './models/Quests'; // Adjust the path to your Quest model

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ message: 'Missing username' });
        }

        try {
            // Connect to the database
            await connectToDatabase();

            const quest = await Quest.findOne({ username: username });

            // Check if the quest exists
            if (!quest) {
                return res.status(404).json({ message: 'Quest not found' });
            }

            // Update I'm Unstoppable! achievement (id: 8)
            const achievement = quest.active_achievements.find(ach => ach.id === '8');

            if (quest.active_quests[0].marked_complete && quest.active_quests[1].marked_complete && quest.active_quests[2].marked_complete) {
                if (achievement.quantity < 3) {
                    if (achievement) {
                        achievement.quantity = quest.streak;
                    } else {
                        quest.active_achievements.push({ id: '8', quantity: quest.streak });
                    }

                    await quest.save();
                }

                return res.status(200).json(quest.streak);
            } else {
                quest.active_quests.forEach(q => q.marked_complete = true);

                if (achievement.quantity < 3) {
                    // Already an active achievement (in progress)
                    if (achievement) {
                        achievement.quantity = quest.streak + 1;
                    } else {
                        quest.active_achievements.push({ id: '7', quantity: quest.streak + 1 });
                    }

                    // Update streak
                    if (quest.streak < 3) {
                        quest.streak += 1;
                    } else {
                        quest.streak = 1;
                    }
                }

                await quest.save();
                return res.status(200).json(quest.streak);
            }

        } catch (e) {
            console.error('Error updating streak:', e);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
