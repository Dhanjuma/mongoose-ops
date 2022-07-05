const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    test: String,
    timestamp: Number,
});

const testBucketSchema = mongoose.Schema({
    _id: String,
    post_id: String,
    test_count: {type: Number, immutable: false, default: 0},
    tests: [testSchema]
}, {collection: 'reviews'});

const model = mongoose.model('TestBucket', testBucketSchema);
module.exports = model;