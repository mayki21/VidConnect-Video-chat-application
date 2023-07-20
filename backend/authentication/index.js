const express = require('express');
const connection = require('./connection/db');
const cors = require("cors");
const userRouter = require('./route/user.route');
// const postRouter = require('./route/post.route');
require("dotenv").config()
const auth = require('./middleware/auth');

const app = express()

app.use(express.json())

app.use(cors())

app.use("/user", userRouter)

// app.use("/", postRouter)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Connected to Database succesfully");
    } catch (error) {
        console.log(error);
        console.log("Some error while connicting to DB");
    }
    console.log(`server is connected to port  ${process.env.port}`);
})