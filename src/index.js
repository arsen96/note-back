const express = require('express');
const app = express();
require('dotenv').config({path:'./config.env'})
const mongoConnection = require('../db/connections');
const cors = require('cors')
// app.use(cors("*"));
// app.use(cors());
app.use(cors({
  origin: 'https://note-qoq30npnx-arsen96s-projects.vercel.app',
  credentials: true,  
}));
const cookieParser = require("cookie-parser");
//sqq
app.use(express.json())
app.use(cookieParser())

const UserRoutes = require('./routes');
const NotesRoutes = require('./notesRoutes');

mongoConnection().then(() => {
    app.listen(process.env.PORT,(req,res) => {
        console.log("readmon PORT "+process.env.PORT);
    })
})

app.use(UserRoutes);
app.use(NotesRoutes);

module.exports =  app;

