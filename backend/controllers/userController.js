const asyncHandler  = require('express-async-handler'); 
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, pic } = req.body;

    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all fields");
    }
    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("Failed to create user");
    }

});

const authUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });

    if(user &&  (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

/// get all the users from database (/api/user)
const allUsers = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name : { $regex: req.query.search, $options: 'i'}},
            { email : { $regex: req.query.search, $options: 'i'}},
        ]
    } : {}

    const users = await User.find(keyword).find({ _id: {$ne: req.user._id} });
    res.send(users);
});


const UpdateUser = (async(req,res) => {
    const {userId,name,pic} = req.body;
    let update;
    console.log(userId,name,pic);
    const filter = { _id: userId};
    if(name) {
        update = { name: name };
    }
    else if(pic){
        update = { pic: pic };
    }
    else {
        res.status(400);
        throw new Error("Invalid Input");
    }
    const result = await User.findOneAndUpdate(filter,update,
        {
            new: true
        }
    );
   if(!result) {
        res.status(400);
        throw new Error("failed");
   }
   else {
     res.json(result);
   }
});

module.exports = { registerUser , authUser, allUsers, UpdateUser};