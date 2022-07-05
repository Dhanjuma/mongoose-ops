const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken');

// change to returning a list of 10 most recent comments
// instead of just the most recent comment
const router = express.Router();

// endpoint to make a comment on a post
router.post('/comment', async (req, res) => {
    const {token, comment, post_id, owner_name, owner_img, user_id} = req.body;

    if(!token || !post_id || !comment || !user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    const timestamp = Date.now();

    try{
        //this verifies a token 
        let user = jwt.verify(token, process.env.JWT_SECRET);

        let mComment = new Comment;
        mComment.comment = comment;
        mComment.post_id = post_id;
        mComment.owner_id = user_id;
        mComment.owner_name = owner_name;
        mComment.owner_img = owner_img || '';
        mComment.timestamp = timestamp;
        
        mComment = await mComment.save();

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {"$inc": {comment_count: 1}},
            {new: true}
        );
        
        return res.status(200).send({status: 'ok', msg: 'Success', post, comment: mComment});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to get comments of a post
router.post('/get_comments', async (req, res) => {
    const {token, post_id, pagec} = req.body;

    if(!token || !post_id || !pagec){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const resultsPerPage = 2;
        let page = pagec >= 1 ? pagec : 1;
        page = page -1;

        const comments = await Comment.find({post_id})
        .sort({timestamp: 'desc'})
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .lean();

        return res.status(200).send({status: 'ok', msg: 'Success', comments});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to delete a comment
router.post('/delete_comment', async (req, res) => {

    const{token, comment_id, post_id} = req.body;

    if(!token || !comment_id || !owner_of_post_id){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }
    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);
        const comment = await Comment.deleteOne({_id: comment_id});

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$inc": {comment_count: -1}
            },
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'delete successful', comment});
    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occured'});
    }
   
});
 
// end point to reply a comment
router.post('/reply_comment', async (req, res) => {
    const {token, reply, comment_id, user_id, post_id} = req.body;

    if(!token || !comment_id || !reply || !user_id || !post_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    const reply_timestamp = Date.now();

    try{
        //this verifies a token 
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const comment = await Comment.findOneAndUpdate(
            {_id: comment_id},
            {
                "$inc": {reply_count: 1},
                "$push": {replies_id: user_id},
                "$push": {replies: reply},
                "$push": {replies_time: reply_timestamp}
            },
            {new: true}
        );

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {
                "$inc": {comment_count: 1},
                 "$inc": {comment_reply_count: 1}
            },
            {new: true}
        );
        
        
        return res.status(200).send({status: 'ok', msg: 'Success', comment});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to edit a comment
router.post('/edit_comment', async (req, res) => {

    const{comment_id, token, nComment} = req.body;

    if(!token || !comment_id){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }

    const edited_at = Date.now();

    try{
        jwt.verify(token, process.env.JWT_SECRET);

        const comment = await Comment.findOneAndUpdate(
            {_id: comment_id},{
                comment: nComment,
                edited:true,
                edited_at: edited_at
            },{new: true});

        return res.status(200).send({status: 'ok', msg: 'Success', comment});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});
module.exports = router;