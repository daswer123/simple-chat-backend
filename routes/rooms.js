const Router = require("express");
const router = Router();

const Rooms = require("../model/room");

router.get("/", async (req,res) => {

    let allRooms = await Rooms.find()
    allRooms = allRooms.map(elem => elem.toObject());

    res.status(200).json(allRooms)
})

router.post("/", (req,res) => {
    const {name, roomId} = req.body;
    res.status(200).json({"roomId" : roomId,"Name" : name})
})

module.exports = router