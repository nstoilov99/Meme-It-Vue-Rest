const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Number, Boolean, ObjectId } = Schema.Types;

const memeSchema = new Schema({

    memeTitle: {
        type: String,
        required: true,
    },

    comments: [{
        type: String,
    }],

    imageUrl: {
        type: String,
        required: true,
    },

    author: {
        type: ObjectId,
        ref: 'User'
    }

});

module.exports = new Model('Meme', memeSchema);