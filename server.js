const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

//middle wares
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// plugging the cotrollers
const authController = require('./controllers/auth.js')

app.use('/auth', authController)
//db connection
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', ()=>{
    console.log(`Connected to: ${mongoose.connection.name}`);
})


app.get('/', async(req,res)=>{
    res.render('index.ejs',{user:req.session.user})
})

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});


app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`);
})