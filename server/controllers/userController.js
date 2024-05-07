const User = require("../models/User");
const cookieToken = require('../utils/cookieToken')
const cloudinary = require('cloudinary').v2;

exports.register = async (req,res) => {
    try {
        const {name, email, password} = req.body;
        

        if(!email || !name || !password){
            return res.status(400).json({
                message : "Name, eamil and password are required"
            })
        }

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message : "User already exists"
            })
        }

        user = await User.create({
            name, email, password
        })
        
        cookieToken(user,res);
        console.log(req.body)
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error...",
            error : error
        })
    }
}

exports.login = async (req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isPasswordCorrect = await user.isValidatedPassword(password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        cookieToken(user,res);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error...",
            error: error
        })
    }
}

exports.updateUserDetails = async (req,res)=>{
    try {
        const {name, password, email, picture} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message: 'User Not Found'
            })
        }
        user.name = name;
        if(picture && !password){
            user.picture = picture;
        }else if(password && !picture){
            user.password = password;
        }else if(picture && password){
            user.picture = picture;
            user.password = password;
        }

        const updatedUser = await user.save();
        cookieToken(updatedUser, res);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error..',
            error
        })
        
    }
}

exports.loggout = async (req,res)=>{
    res.status(200)
    .cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite:'none'
    }).json({
        success: true,
        message: 'Logged Out'
    })
}

exports.uploadPicture = async (req,res)=>{
    const {path} = req.file
    try {
        let result = await cloudinary.uploader.upload(path,{
            folder:'Airbnb/Users'
        })
        res.status(200).json(result.secure_url);
    } catch (error) {
        res.status(500).json({
            error,
            message: 'Internal Server Error..'
        })
    }
}