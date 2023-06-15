const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));
dotenv.config()
app.use(express.json())
app.use(cookieParser())

const User = require("./models/user")
const login = require("./LoginRegisterLogout/login")
const register = require("./LoginRegisterLogout/register")
const profile = require("./LoginRegisterLogout/profile")
const {messagesBetweenTwoUsers , fileUpload} = require("./utils")
const { initWebSocketServer } = require('./websocket');




mongoose.connect(process.env.MONGO_URL)

const cors = require("cors")
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}))


app.get("/profile", profile)
app.post("/login", login);
app.post("/register", register);
app.get("/messages/:userId", messagesBetweenTwoUsers)
app.get("/people", async (req, res) => {
    const people = await User.find({}, { _id: 1, username: 1 });
    res.json(people)
})

app.post('/upload/:userId',async (req, res) => {
    const {userId} = req.params
    const base64String = req.body.file;
    const fileName = req.body.fileName;
    const file = await fileUpload(base64String,fileName);
    console.log("API " + file)
    res.send(file);
  });
  

const server = app.listen(5001, (req, res) => {
    console.log("server is listening on 5001");
})
initWebSocketServer(server);


