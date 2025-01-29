const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth-middleware.js')
const adminMiddleware = require('../middleware/admin-middleware.js')

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {

    const { userId, userName, role } = req.userInfo

    res.json({
        message: 'Welcome to admin page',
        data: {
            userId,
            userName,
            role
        }
    })
})

module.exports = router