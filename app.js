const express = require('express');
const dotenv = require("dotenv");
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require("path")
// const { constants } = require('buffer');

app.use(cookieParser())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 4000;
require('./DB/conn');
// const User = require("./model/userSchema")

app.use(express.json());

app.use(require('./router/auth'));

app.use(express.static(path.join(__dirname, './client/build')))

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})