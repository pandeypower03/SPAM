// app.js
require("dotenv").config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); // if you ever accept form data
app.use(express.json());//this will parse the incoming request with JSON payloads

//from the server.js the request goes to routes/user.js and then to controllers/user.js
//and then to models/models.js
app.use('/users',require('./routes/user'));


const PORT = process.env.PORT ;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
