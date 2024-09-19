const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const Ratings = new Schema({
    username: {
        type: String
    },
    rating_value: {
        type: Number
    },
    date: {
        type: Object
    }
})

const RatingSchema = new Schema({
    book_name: {
        type: String
    },
    volume_id: {
        type: String
    },
    ratings: [Ratings]
});


const RatingModel = model('Rating', RatingSchema);

module.exports = RatingModel;