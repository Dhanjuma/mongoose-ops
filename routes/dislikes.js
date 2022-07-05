const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

const router = express.Router();

// endpoint to dislike a post
router.post('/dislike_post', async (req, res) => {
    const {token, post_id, user_id} = req.body;

    if(!token || !post_id || !user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        jwt.verify(token, process.env.JWT_SECRET);

        const found = await Post.findOne({_id: post_id, dislikes: user_id});

        if(found)
            return res.status(400).send({status: 'error', msg: 'You already disliked this post'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$push": {dislikes: user_id},
                "$inc": {dislike_count: 1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Success', post});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to dislike a comment on a post
router.post('/dislike_comment', async (req, res) => {
    const {token, comment_id, user_id, post_id} = req.body;

    if(!token || !comment_id || !user_id || !post_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        jwt.verify(token, process.env.JWT_SECRET);

        const found = await Comment.findOne({_id: comment_id, dislikes: user_id});

        if(found)
            return res.status(400).send({status: 'error', msg: 'You already disliked this comment'});

     
            
        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$inc": {comment_dislike_count: 1}
            },
            {new: true}
        ).lean();


        const comment = await Comment.findOneAndUpdate(
            {_id: comment_id},
            {
                "$push": {dislikes: user_id},
                "$inc": {dislike_count: 1}
            },
            {new: true}
        ).lean()

        return res.status(200).send({status: 'ok', msg: 'Success', comment});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});
// endpoint to undislike a post
router.post('/undislike_post', async (req, res) => {
    const {token, post_id, user_id} = req.body;

    if(!token || !post_id || !user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        jwt.verify(token, process.env.JWT_SECRET);

        const found = await Post.findOne({_id: post_id, dislikes: user_id});

        if(!found)
            return res.status(400).send({status: 'error', msg: 'You haven\'t disliked this post before'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$pull": {dislikes: user_id},
                "$inc": {dislike_count: -1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Success', post});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to undislike a comment on a post
router.post('/undislike_comment', async (req, res) => {
    const {token, comment_id, user_id, post_id} = req.body;

    if(!token || !comment_id || !user_id || !post_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }
    try{
        jwt.verify(token, process.env.JWT_SECRET);

        const found = await Comment.findOne({_id: comment_id, dislikes: user_id});

        if(!found)
            return res.status(400).send({status: 'error', msg: 'You have not liked this comment'});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$inc": {comment_dislike_count: -1}
            },
            {new: true}
        ).lean();

        const comment = await Comment.findOneAndUpdate(
            {_id: comment_id},
            {
                "$pull": {dislikes: user_id},
                "$inc": {dislike_count: -1}
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