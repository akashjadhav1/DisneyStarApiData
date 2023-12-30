const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



const secretKey = "mynameisakashramravjadhavakashaj"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens:[
        {
            token:{
                type: String,
                required: true,
            }
        }
    ]
});

userSchema.methods.generateAuthtoken = async function() {
    try {
        let token1 = jwt.sign({ _id: this._id }, secretKey, {
            expiresIn: "1d",
        });

        this.tokens = this.tokens.concat({ token: token1 });
        await this.save();
        return token1;
    } catch (error) {
        // You cannot use res.status(401) here as res is not defined in this scope
        console.error(error);
        throw new Error(error.message);
    }
};

const User =new mongoose.model('User', userSchema); 

module.exports = User;