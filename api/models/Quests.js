const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const ActiveQuestSchema = new Schema({
    id: {
        type: String
    },
    quantity_achieved: {
        type: Number,
        default: 0
    },
    marked_complete: {
        type: Boolean,
        default: false
    },
    claimed: {
        type: Boolean,
        default: false
    },
    held_xp: {
        type: Number,
        default: 0
    },
    held_coins: {
        type: Number,
        default: 0
    }
})

const ActiveAchievements = new Schema({
    id: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    },
    date: {
        type: Date
    },
    claimed: {
        type: Boolean,
        default: false
    }
})

const QuestsSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    active_quests: [ActiveQuestSchema],
    active_achievements: [ActiveAchievements],
    daily_quest_time: {
        type: Date,
        default: null
    },
    streak: {
        type: Number,
        default: 0
    }
});

const QuestsModel = model('Quests', QuestsSchema);

module.exports = QuestsModel;