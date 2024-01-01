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
        const token = jwt.sign({ _id: this._id }, secretKey, {
            expiresIn: "1d",
        });

        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (error) {
        console.error('Error generating auth token:', error);
        throw new Error('Unable to generate auth token');
    }
};

const User =new mongoose.model('users', userSchema); 

module.exports = User;