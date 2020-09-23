require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

app.use(express.json())

const users = []

const posts = [
    {
        email: "jim",
        title: 'Posts 1'
    },
    {
        email: "kyle",
        title: 'Posts 2'
    }
]

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) =>{
    res.render('index.ejs')
})

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.email === req.user.name))
})

// app.get('/login', (req, res) =>{
//     res.render('login.ejs')
// })

// app.post('/login', (req, res) =>{
//     const email = req.body.email
//     const user = {name: email}

//     const accessToken = jwt.sign(user,
//     process.env.ACCESS_TOKEN_SECRET)
//     res.json( {accessToken: accessToken} )
// })

// app.get('/register', (req, res) =>{
//     res.render('register.ejs')
// })

// app.post('/register', async (req, res) =>{
//     try{
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         users.push({
//             id: Date.now().toString(),
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword
//         })
//         res.redirect("/login")
//     } catch{
//         res.redirect('/register')
//     }
//     console.log(users)
// })


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token ==null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.listen(3000)