const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name'],
        maxlength: [30, 'Your Name cannot 30 Characters']
    }, 
    email: {
        type: String,
        required: [true, 'Please Enter your Email'],
        unique: true,
        validate: [validator.isEmail, 'Please Valid Email Address']

    },
    password: {
        type: String,
        required: [true, 'PLease Enter Your Password'],
        minlength: [6, 'Your Password must be longer than 6 characters'],
        select: false

    },
    avatar: {
        public_id : {
            type : String,
            // required : true,
        },
        url : {
            type: String,
            // required: true
        }

    },
    role : {
        type: String,
        default: 'user'
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        token: {
            type: String,
            // required: true
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date

})


//compare Password 
userSchema.method.comparePassword = async function(enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)

}

//Generate jsonwebtoken
userSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({ id : this._id.toString() }, 'mysecretkey', {expiresIn: 3000000})

    this.tokens = this.tokens.concat({ token })

    await this.save()

    return token;

}




//login user 
userSchema.statics.fetchdata = async (email, password) => {
    const user = await User.findOne({email}).select('+password')

    if (!user) {
        throw new Error("Unable to Login")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new Error("pls try Again")
    }

    return user;
}


//Hash Password  
userSchema.pre('save', async function (next) {

//retruns true if 'password' path is modified else false    
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})


const User =  mongoose.model('User', userSchema);

module.exports = User;