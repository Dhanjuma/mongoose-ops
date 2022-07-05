const express = require('express');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();


// signup endpoint
router.post('/signup', async (req, res) => {
    const {email, password:plainTextPassword, phone, fullname} = req.body;


    // console.log(req.body);
    // checks
    if(!email || !plainTextPassword){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }

    const password = await bcrypt.hash(plainTextPassword, 10);
    try{

        const timestamp = Date.now();

        let user = new User;

        user.email = email;
        user.password = password;
        user.fullname = fullname;
        user.phone = phone;
        user.username = `${email}_${timestamp}`;
        user.img = '';
        user.img_id = '';

        user = await user.save();

        const token = jwt.sign({
            _id: user._id,
            email: user.email
        },process.env.JWT_SECRET);

        // TODO: Debug later
        // console.log(user, 'here 1');
        // user['token'] = token;

        // console.log(user, 'here 2');

        return res.status(200).send({status: 'ok', msg: 'User created', user, token});

    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occured'});
    }
});


// login endpoint
router.post('/login', async (req, res) => {
    const {email, password: plainTextPassword, token} = req.body;

    // checks
    if(!email || !plainTextPassword || !token){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }

    try{
        const found = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({email: email}).lean();
        if(!user){
            return res.status(404).send({status: 'error', msg: `No user with email: ${email} found`});
        }

        if (!(await bcrypt.compare(plainTextPassword, user.password))){
            return res.status.apply(400).send({status: 'error', msg: 'Email or password incorrect'});
        }

        delete user.password;
        return res.status(200).send({status: 'ok', msg: 'Login successful', user});
    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occured', e});
    }
});


// endpoint to delete a user
router.post('/delete_user', async (req, res) => {

    const {user_id, token, password} = req.body;

    if(!user_id || !token || !password){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }
    try{
        jwt.verify(token, process.env.JWT_SECRET);

        if(!(await bcrypt.compare(password, user.password))){
            return res.status(400).send({status: 'error', msg: 'Incorrect email or password'})
        }

        const user = await User.deleteOne({_id: user_id});

        return res.status(200).send({status: 'ok', msg: 'delete successful', user});

    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occured', e});
    }


});

// endpoint to change password
router.post('/change_password', async (req, res) => {
    const {email, token, password, newpassword:plainTextPassword, confirmpassword} = req.body;

    if(!email || !token || !password){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }

    try{
        jwt.verify(token, process.env.JWT_SECRET);

        if(plainTextPassword !== confirmpassword){
            return res.status(400).send({status: 'error', msg:'Passwords do not match.'})
        }

        const user = await User.findOne({email: email}).lean();

        if(!user)
            return res.status(400).send({status: 'error', msg: 'user not found'});
        console.log(password);

        if(!(await bcrypt.compare(password, user.password))){
            return res.status(400).send({status: 'error', msg: 'Incorrect email or password'})
        }
        const npassword = await bcrypt.hash(plainTextPassword, 10)
        await User.updateOne({email},{
         $set:{password: npassword}
        })
        return res.status(200).send({status: 'ok', msg: 'password change successful', user})
    }catch(err){
        console.log(err)
        return res.status(400).send({status: 'error', msg: 'Some error occured',});
    }
});

module.exports = router;