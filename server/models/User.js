const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: true,
        default: 'https://res.cloudinary.com/dibnpb3so/image/upload/v1715048964/img/user_fjbdfo.jpg'
    }
})

userSchema.pre('save', async function(next){ //저장하기전에..
    this.password = await bcrypt.hash(this.password,10) //해싱이 된 비밀번호 저장
})

userSchema.methods.isValidatedPassword = async function (userSentPassword) {
    return await bcrypt.compare(userSentPassword, this.password);
}

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

const User = mongoose.model("User",userSchema);

module.exports = User;
