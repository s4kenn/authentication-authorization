const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const AuthRoutes = require('./routes/auth-routes.js')
const WelcomeRoutes = require('./routes/welcome-route.js')
const AdminRoutes = require('./routes/admin-route.js')

const connectToDB = require('./database/db.js')

const app = express()
app.use(express.json())

connectToDB()

app.use('/api/auth', AuthRoutes)
app.use('/api/home', WelcomeRoutes)
app.use('/api/admin', AdminRoutes)

const PORT = process.env.PORT || 6969

app.listen(PORT, () => {
    console.log(`Server has started on port number ${PORT}`);
})
