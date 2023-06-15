const Message = require("./models/message")
const jwtSecret = process.env.SECRET
const jwt = require("jsonwebtoken")
const path = require("path")
const fs = require("fs")
const { rejects } = require("assert")

async function getAllMessages(userId1, userId2) {
    // Query the messages collection using Mongoose
    if (userId1 && userId2) {

        const messages = await Message.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        }).populate('sender receiver', 'username').sort({ createdAt: 1 }).exec();

        // Return the result
        return messages;
    } else {
        return null;
    }
}

function verifyTokenAndGetUser(req) {
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookie = cookies.split(',').find(str => str.startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            console.log(token);
            const decodedToken = jwt.verify(token, jwtSecret);
            const { userId, username } = decodedToken;
            console.log(decodedToken);
            return { userId, username };
        }
    }
    return null;
}

async function messagesBetweenTwoUsers(req, res) {

    const { userId: user1 } = verifyTokenAndGetUser(req);
    const user2 = req.params.userId
    try {
        const messages = await getAllMessages(user1, user2);
        // console.log(messages)
        res.status(200).json(messages)
    } catch (e) {
        res.status(400).send("Invalid Ids")
    }
}

async function fileUpload(file , fileName){
    const base64String = file;
    fileName = Date.now() + fileName;
    // Decode the base64 string
    const decodedImage = Buffer.from(base64String, 'base64');

    // Save the decoded image to the uploads folder
    const filePath = path.join(__dirname, 'uploads', fileName);
    return new Promise((resolve,reject)=>{ 
      fs.writeFile(filePath, decodedImage, (err) => {
      if (err) {
        console.error(err);
        reject(err)

      } else {
        resolve(fileName)
      }
    });
});
}

module.exports = { getAllMessages, verifyTokenAndGetUser ,messagesBetweenTwoUsers,fileUpload}