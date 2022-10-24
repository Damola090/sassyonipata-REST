const jwt = require('jsonwebtoken');
const User = require('../models/User')

const ErrorHandler = require('../Util/errorHandler');

const AuthMiddleware = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decodedToken = jwt.verify(token, 'mysecretkey')

        const user = await User.findOne({ _id: decodedToken.id, 'tokens.token': token })
        // const user = await User.findById(decodedToken._id)

        

        if (!user) {
            throw new Error('Error, Please Authenticate')
        }

        req.user = user
        req.token = token

        next()

        console.log("First Middleware has been crossed")
    } catch (err) {

        res.status(401).send({ error : 'You need to Authenticate'})

    }
}

//Handling user Roles
const AuthorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                // new ErrorHandler(`Role ${req.user.role} is not Authourized to access this resource`, 403)
                res.status(401).json({ message : `Role ${req.user.role} is not Authourized to access this resource`})
            )

        }
        next()
        console.log('second middleware has been crossed')
    }
}

module.exports =  {
    AuthMiddleware : AuthMiddleware,
    AuthorizeRoles : AuthorizeRoles
}