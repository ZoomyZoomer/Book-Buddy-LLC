import { connectToDatabase } from '../api/utils/db'
import stripe from 'stripe'; // Ensure you have Stripe imported and configured
const stripeClient = stripe(process.env.STRIPE_API_KEY);
import Inventory from './models/Inventory'; // Adjust the path to your Inventory model
import Quest from './models/Quests'; // Adjust the path to your Inventory model

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const sessionId = req.query.session_id;
        const market = JSON.parse(decodeURIComponent(req.query.market));
        const value = req.query.value;
        const username = req.query.username;

        connectToDatabase().then(async () => {
            try {
                const inventory = await Inventory.findOne({ username: username });

                const session = await stripeClient.checkout.sessions.retrieve(sessionId);

                if (session.payment_status === 'paid') {
                    const relevant_ticket = inventory.purchase_orders.find(ticket => ticket === sessionId);

                    if (relevant_ticket) {
                        res.json({ paymentSuccess: false });
                        return;
                    } else {
                        // Push ticket as verified
                        inventory.purchase_orders.push(sessionId);

                        // Add purchased item to inventory
                        const relevant_item = inventory.collectables.find(item => item.id === market.id);

                        if (relevant_item) {
                            relevant_item.quantity += Number(value);
                        } else {
                            if (market.id) {
                                inventory.collectables.push({ id: market.id, quantity: Number(value) });
                            }
                        }

                        // Check if Merchant quest is present (id: 4)
                        const quest = await Quest.findOne({ username: username });
                        const relevant_quest = quest.active_quests.find(quest => quest.id === '4');

                        if (relevant_quest) {
                            if (!relevant_quest.quantity_achieved >= 1) {
                                relevant_quest.quantity_achieved += 1;
                            }
                            await quest.save();
                        }

                        await inventory.save();
                    }

                    res.json({ paymentSuccess: true });
                } else {
                    res.json({ paymentSuccess: false });
                }
            } catch (error) {
                res.status(500).json({ error: 'Verification failed' });
            }
        }).catch(err => {
            res.status(500).json({ error: 'Database connection failed' });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
