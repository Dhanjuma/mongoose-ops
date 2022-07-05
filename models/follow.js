const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    follower_id: String,
    following_id: String // the person being followed
}, {collection: 'follows'});

const model = mongoose.model('Follow', followSchema);
module.exports = model;