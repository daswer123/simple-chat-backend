const {Schema,model} = require("mongoose");

const roomSchema = new Schema({
    roomName : {
        type: String,
        required : true
    },
    users : [{
        socketId : String,
        username : String
    }],
    messages: [{
        user: String,
        text: String
    }]
})

module.exports = model("Rooms", roomSchema);