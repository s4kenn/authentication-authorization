const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth-middleware.js')

const { registerUser, loginUser, changePassword } = require('../controllers/auth-controller.js')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password', authMiddleware, changePassword)

module.exports = router

