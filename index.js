const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// init mongoose
mongoose.connect(process.env.MONGO_URL)
.catch(error=> console.log(`DB Connection error: ${error}`));
const con = mongoose.connection;

con.on('open', error => {
    if(!error){
        console.log('DB connection successful');
    }else{
        console.log(`DB connection failed with error: ${error}`);
    }
});

con.on('disconnected', error => {
    console.log(`Mongoose lost connection to DB: ${error}`);
})

app.use(express.json());
app.use(express.urlencoded());

app.use('/auth', require('./routes/auth'));
app.use('/post', require('./routes/posts'));
app.use('/follow', require('./routes/follow'));
app.use('/like', require('./routes/likes'));
app.use('/test', require('./routes/test'));
app.use('/comment', require('./routes/comment'));
app.use('/profile', require('./routes/profile'));
app.use('/search', require('./routes/search'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))

/**
 * TODOS
 * 
 * Follow
 * Unfollow
 * Fetch posts based on users a person is following
 * 
 * Like, Unlike
 * Dislike, Undislike*
 * Comment
 * 
 * Search
 * 
 const posts = await Post.find({
            '$or': [
            {title: new RegExp(search_string, 'i')},
            {body: new RegExp(search_string, 'i')}
        ]}, {timestamp: 1, owner_name: 1, owner_img: 1, title: 1,
            body: 1, like_count: 1, comment_count: 1, owner_id: 1})

upload.array('post-files', 10)
let img_urls = [];
let img_ids = [];
 */