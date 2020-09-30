const express = require("express");
const mongoose = require("mongoose");

const app = express();
const server= require("http").Server(app);
const io = require("socket.io")(server);

const chatRouter = require("./routes/rooms");

app.use(express.urlencoded({extended : true}));

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin" , "*"),
    next()
})

app.use("/rooms",chatRouter);

io.on("connection", socket => {
    console.log("socket connected ",socket.id)
    socket.on("disconnect",() => {
        console.log("user disconected")
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

