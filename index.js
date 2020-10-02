const express = require("express");
const mongoose = require("mongoose");

const app = express();
const server= require("http").Server(app);
const io = require("socket.io")(server);

const Rooms = require("./model/room")

const chatRouter = require("./routes/rooms");

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin" , "*"),
    next()
})

app.use("/rooms",chatRouter);

io.on("connection", socket => {
    console.log("socket connected ",socket.id)
    
    socket.on("send-message",async message => {        
        const room = await Rooms.find({ "users" : { $elemMatch : {"socketId" : socket.id}}});
        room[0].messages.push(message)
        await room[0].save();

        socket.to(room[0].roomName).broadcast.emit("send-message", ({message,roomName : room[0].roomName}));
    })

    socket.on("new-user",(user) => {
        socket.join(user.roomName)
        io.to(user.roomName).emit("new-user",user)
    })

    
    socket.on("disconnect", async () => {
        const room = await Rooms.find({ "users" : { $elemMatch : {"socketId" : socket.id}}});
        
        if (room.length === 0){
            return
        }
        const fixedRoom = room[0]
        fixedRoom.users = room[0].users.filter(elem => elem.socketId !== socket.id);

        room[0] = fixedRoom
        await room[0].save()

        io.to(room[0].roomName).emit("user-leave",{users : fixedRoom.users, roomName : fixedRoom.roomName})
        console.log("user disconected")

        socket.removeAllListeners();
    })
})



const PORT = process.env.PORT || 8080

const start = async () =>{
    try {
        await mongoose.connect("mongodb+srv://daswer_chat:4ZhJjpyYh1PN3wOw@cluster0.4jm4e.mongodb.net/simple-chat?retryWrites=true&w=majority"
        ,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify : false
        });
        server.listen((PORT), () => {
            console.log("Сервер запущен порт " + PORT)
        })
    } catch(err){
        throw new Error(err)
    }
}

start()

