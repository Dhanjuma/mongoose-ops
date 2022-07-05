const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: String,
    post_id: String,
    comment_id: String,
    owner_id: String,
    owner_name: String,
    owner_img: String,
    timestamp: Number,
    edited: {type: Boolean, default: false},
    edited_at: Number,
    like_count: {type: Number, default: 0},
    likes: [String],
    dislike_count: {type: Number, default: 0},
    dislikes: [String],
    reply: String,
    reply_count: {type: Number, default: 0},
    replies_id: [String],
    replies: [String],
    replies_timestamp: Number
}, {collection: 'comments'});

const model = mongoose.model('Comment', commentSchema);
module.exports = model;