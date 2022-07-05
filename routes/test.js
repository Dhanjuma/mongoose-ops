const express = require('express');
const TestBucket = require('../models/test');

const router = express.Router();

router.post('/test', async (req, res) => {
    const {test, post_id} = req.body;

    if(!test || !post_id){
        return res.status(400).json({status: 'error', msg: 'All fields must be entered'});
    }

    // get timestamp
    const timestamp = Date.now();
    try{

        const regex = new RegExp("^" + post_id + "_");
        // add comment
        await TestBucket.updateOne(
            {
                _id: regex,
                test_count: {"$lt": 3}
            },
            {
                "$push": {"tests": {
                    test,
                    timestamp,
                }},
                "$inc": {"test_count": 1},
                "$setOnInsert": {_id: `${post_id}_${timestamp}`},
            },
            {upsert: true}
        );

        // update a comment count to the post doc

        // use that comment_count to update the current page by (comment_count / comments_per_page)
        // if a comment_count ends with a number greater than 0, then heighest_page_count = comment_count + 1 / comments_per_page

        return res.status(200).send({status: "ok", msg: "Test Sent", test: {
            test,
            timestamp
        }});

    }catch(e){
        console.log(e);
        return res.status(400).json({status: 'error', msg: e});
    }

});

router.post('/get_tests', async (req, res) => {
    const {post_id, pagec} = req.body;

    if(!post_id || !pagec){
        return res.status(400).json({status: 'error', msg: 'All fields must be entered'});
    }

    const timestamp = Date.now();
    try{

        const regex = new RegExp("^" + post_id + "_");
        
        const tests = await TestBucket.find({_id: regex}).sort({_id: 1}).skip(pagec).limit(1);

        return res.status(200).send({status: "ok", msg: "Test Sent", tests});

    }catch(e){
        console.log(e);
        return res.status(400).json({status: 'error', msg: e});
    }
});

const cc1 = '50';
const cc2 = '89';
const cc3 = '106';
const cc4 = '140';
const cc5 = '167';
const cc6 = '1256';


if(cc2[cc2.length - 1] === '0'){
    // all good
    const highest_page = parseInt(cc2) / 10;
    // first fetch : highest_page
    // second fetch : highest_page - 1
}else{
    if(cc2.length == 1){
        const highest_page = 1;
    }else if(cc2.length == 2){
        const highest_page = parseInt(cc2[0]) + 1;
    }else if(cc2.length === 3){
        const highest_page = parseInt(cc2[0] + cc2[1]) + 1;
    }else if(cc2.length === 4){
        const highest_page = parseInt(cc2[0] + cc2[1] + cc2[2]) + 1;
    }else if(cc2.length === 5){
        const highest_page = parseInt(cc2[0] + cc2[1] + cc2[2] + cc2[3]) + 1;
    }
}

module.exports = router;