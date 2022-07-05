const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

const router = express.Router();

// endpoint to like a post
router.post('/like_post', async (req, res) => {
    const {token, post_id, user_id} = req.body;

    if(!token || !post_id || !user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const found = await Post.findOne({_id: post_id, likes: user_id});

        if(found)
            return res.status(400).send({status: 'error', msg: 'You already liked this post'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$push": {likes: user_id},
                "$inc": {like_count: 1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Success', post});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to like a comment on a post
router.post('/like_comment', async (req, res) => {
    const {token, comment_id, post_id, user_id} = req.body;

    if(!token || !comment_id || !user_id || !post_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const found = await Comment.findOne({_id: comment_id, likes: user_id});

        if(found)
            return res.status(400).send({status: 'error', msg: 'You already liked this comment'});

     
            
        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$inc": {comment_like_count: 1},
                "$inc": {like_count: 1}
            },
            {new: true}
        ).lean();


        const comment = await Comment.findOneAndUpdate(
            {_id: comment_id},
            {
                "$push": {likes: user_id},
                "$inc": {like_count: 1}
            },
            {new: true}
        ).lean()

        return res.status(200).send({status: 'ok', msg: 'Success', comment});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});


// endpoint to unlike a post
router.post('/unlike_post', async (req, res) => {
    const {token, post_id, user_id} = req.body;

    if(!token || !post_id || !user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const found = await Post.findOne({_id: post_id, likes: user_id});

        if(!found)
            return res.status(400).send({status: 'error', msg: 'You haven\'t liked this post before'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$pull": {likes: user_id},
                "$inc": {like_count: -1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Success', post});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to unlike a comment on a post
router.post('/unlike_comment', async (req, res) => {
    const {token, comment_id, post_id, user_id} = req.body;

    if(!token || !comment_id || !post_id || !user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }
    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const found = await Comment.findOne({_id: comment_id, likes: user_id});

        if(!found)
            return res.status(400).send({status: 'error', msg: 'You have not liked this comment'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$inc": {comment_like_count: -1},
                "$inc": {like_count: -1}
            },
            {new: true}
        ).lean();

        const comment = await Comment.findOneAndUpdate(
            {_id: comment_id},
            {
                "$pull": {likes: user_id},
                "$inc": {like_count: -1}
            },
            {new: true}
        ).lean()

        return res.status(200).send({status: 'ok', msg: 'Success', comment});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

module.exports = router;