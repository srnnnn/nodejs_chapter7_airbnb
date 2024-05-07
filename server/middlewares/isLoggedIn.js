const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isLoggedIn = async (req,res,next) =>{
    // const token = req.cookies.token || req.header('Authorization').replace('Bearer ',''); //원래 vod 코드
    //여기1
    let token;
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // If the Authorization header exists and starts with 'Bearer'
        token = req.headers.authorization.replace('Bearer ', '');
    }
    //여기1 까지 gpt 수정

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'Login first to do this',
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        console.log('여기 logged'+ error)
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }
}