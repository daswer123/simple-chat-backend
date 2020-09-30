const {Schema,model} = require("mongoose");

const roomSchema = new Schema({
    room: {
        roomName: String,
        users: Array
    },
    messages: [{
        user: String,
        text: String
    }]
})

module.exports = model("Rooms", roomSchema);