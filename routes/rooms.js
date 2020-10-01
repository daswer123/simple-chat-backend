const Router = require("express");
const router = Router();
const Rooms = require("../model/room");

router.get("/:roomId", async (req,res) => {

    let allRooms = await Rooms.find({roomName : req.params.roomId})
    allRooms = allRooms.map(elem => elem.toObject());

    res.status(200).json(allRooms)
})

router.post("/",async (req,res) => {
    const {roomName,username,id} = req.body;
    const isRoomExists = await Rooms.findOne({roomName})

    if (isRoomExists === null){
        const room = new Rooms({
            roomName,
            users : [{
                username : username,
                socketId : id
            }],
            messages : []
        })
        await room.save()
      return res.status(200).json({room})

    } else {
        if ( isRoomExists.users.some(elem => elem.username.toString() === username) ){
           return res.status(422).json({message : "Этот пользователь уже в чате"})
        }
        isRoomExists.users.push({username,socketId : id});
        isRoomExists.save();

        res.status(200).json({message : "Ok"})
    }

   
})

module.exports = router