const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender: {type : mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver: {type : mongoose.Schema.Types.ObjectId, ref: 'User'},
    msg: String,
    filePath: {type: String, default: null},
},{
    timestamps: true
})

const MessageModel = mongoose.model('Message',MessageSchema)

module.exports  = MessageModel