const User = require('../models/User');
const ErrorHandler = require('../Util/errorHandler')

//User
// 1. Create New User       -                    /api/v1/register                   DONE
// 2. Login User            -                    /api/v1/login                      DONE
// 3. Get Currently logged in user Profile -     /api/v1/me                         DONE
// 4. logout User                          -     /api/v1/logout                     DONE
// 5. logout allDevices                  -       /api/v1/logoutAll                  DONE


// 6. Update / Change Password             -     /api/v1/password/update
// 7. Update user Profile                  -     /api/v1/me/update

// 8. Forgot Pasword                       -     /api/v1/password/forgot
// 9. Reset Password                       -     /api/v1/password/reset/:token


//Admin
// 1. Get All Users                        -    /api/v1/admin/users
// 2. Get a Particular User Details        -    /api/v1/admin/user/:id      GET
// 3. Update a Particular User Profile     -    /api/v1/admin/user/:id      PUT
// 4. Delete User                          -    /api/v1/admon/user/:id      DELETE


// 1. Create New User       -                    /api/v1/register  
const registerUser = async (req, res, next) => {

    try {

        const user = new User(req.body)
        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).json({
            success: true,
            user: user,
            token: token
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: new ErrorHandler('New User Failed to be created', 400),
            err: err
        })
    }
}

// 2. Login User            -                    /api/v1/login 
const loginUser = async (req, res, next) => {

    try {

        const { email, password } = req.body
        
        if (!email || !password) {

            return next( new ErrorHandler('Please type in your email & password', 401))
        }

        const user = await User.fetchdata(req.body.email, req.body.password)

        const token = await user.generateAuthToken()


        res.status(200).json({
            success: true,
            document: user,
            token: token
        })

    } catch (err) {
        console.log(err)

        res.status(400).json({
            success: 'login Failed',
            message: err

        })

    }
}

// 3. Get Currently logged in user Profile -     /api/v1/me                         DONE
const getUserProfile = async (req, res, next) => {

    try {

        const user = req.user
        // const user = await User.findById(req.user.id)

        res.status(200).json({
            success: true,
            user

        })

    } catch (err) {

        res.status(404).json({
            success: false,
            message: 'please try again'
        })

    }

}

// 4. logout User                          -     /api/v1/logout                     DONE 
const logoutUser = async (req, res, next) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.status(200).json({
            success: true,
            message: 'This particular user has been logged out'
        })

    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: 'Unable to logOut'
        })

    }
}

// 7. logout allDevices                  -       /api/v1/logoutAll                  DONE
const logoutAllDevices = async (req, res, next) => {

    try {

        req.user.tokens = []
        await req.user.save()

        res.status(200).json({
            success: true,
            message: 'User have been logged out from all devices'
        })

    } catch (err) {

        res.status(500).json({
            success: 'false',
            message: 'Bad request'
        })

    }

}

//Update Password
const UpdatePassword = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id).select('+password');

        const isMatched = await user.comparePassword(req.body.oldPassword);

        console.log(user)

        if (!isMatched) {
            return next(new ErrorHandler('Old password is incorrect', 401))
        }

        user.password = req.body.password

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Your password has been changed successfully'

        })

    } catch (err) {

        res.status(400).json({
            success: false,
            message: 'something went wrong'
        })
    }
}


// 1. Get All Users                        -    /api/v1/admin/users
const GetAllUsers = async (req, res, next) => {

    const users = await User.find()

    res.status(200).json({
        success: true,
        data: users

    })


}


module.exports = {
    registerUser: registerUser,             // Create User
    loginUser: loginUser,                   // Login User
    getUserProfile: getUserProfile,
    logoutUser: logoutUser,
    logoutAllDevices: logoutAllDevices,
    UpdatePassword: UpdatePassword,

    //Admin
    GetAllUsers: GetAllUsers

}