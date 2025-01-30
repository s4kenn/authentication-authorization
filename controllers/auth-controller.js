const User = require('../models/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const registerUser = async (req, res) => {

    try {

        const { username, email, password, role } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }

        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] })

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: "User with username or email already exists"
            })
        }

        // hashed password generated
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const createNewUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        if (createNewUser) {
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: createNewUser
            })
        } else {
            return res.status(500).json({
                success: false,
                message: 'Unable to create new user'
            })
        }

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Internal Server Error -> ${error.message}`,
        })

    }


}

const loginUser = async (req, res) => {

    try {

        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }

        const checkIfUserExists = await User.findOne({ username })

        if (!checkIfUserExists) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const checkValidPassword = await bcrypt.compare(password, checkIfUserExists.password)

        if (!checkValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }



        const accessToken = jwt.sign({

            userId: checkIfUserExists._id,
            userName: checkIfUserExists.username,
            role: checkIfUserExists.role

        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30m'
        })

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken: accessToken
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Internal Server Error -> ${error.message}`,
        })

    }

}

const changePassword = async (req, res) => {

    try {

        const userId = req.userInfo.userId

        // extract old and new password
        const { oldPassword, newPassword } = req.body

        // find current logged in user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User not found`
            })
        }

        // check if old password is correct
        const isValidPassword = await bcrypt.compare(oldPassword, user.password)
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'You entered wrong old password. Please try again'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // update user password
        user.password = hashedPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            data: user
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: `Internal Server Error -> ${error.message}`,
        })
    }

}

module.exports = { registerUser, loginUser, changePassword }