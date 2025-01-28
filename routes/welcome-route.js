const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth-middleware.js')

router.get('/welcome', authMiddleware, (req, res) => {

    const { userId, userName, role } = req.body

    res.json({
        message: 'Welcome to homepage',
        data: {
            userId,
            userName,
            role
        }
    })
})

module.exports = router