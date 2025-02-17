const { faBullseye } = require('@fortawesome/free-solid-svg-icons');
const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const NotifSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    sentBy: {
        type: String,
        required: true
    },
    dateSent: {
        type: Date
    },
    messageContents: {
        type: String
    },
    notificationRead: {
        type: Boolean,
        default: false
    },
    isStarred: {
        type: Boolean,
        default: false
    }
})

const UserSchema = new Schema({
    username: {type: String, required: true, min: 4, unique: true},
    email: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                // Regular expression to validate email format
                return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        unique: true,
    },
    password: {type: String, required: true},
    verificationCode: { type: Number },
    codeExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    reader: {type: String, default: 'Newcomer'},
    googleAuth: {type: Boolean, default: false},
    notifications: [NotifSchema],
    globalNotificationsSeen: []
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;