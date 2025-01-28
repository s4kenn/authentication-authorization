const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }

    try {

        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(decodedTokenInfo);

        req.body = decodedTokenInfo
        next()

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

    next()


}


module.exports = authMiddleware