const express = require("express");
const app = express();

app.use(express.urlencoded({extended : true}));

const PORT = process.env.PORT || 3000

app.listen((PORT), () => {
    console.log("Сервер запущен")
})