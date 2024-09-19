const mongoose = require('mongoose');
const {Schema, model} = mongoose;

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
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;