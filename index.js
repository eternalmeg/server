const express = require('express');
const routs = require('./routs');
const mongoose = require('mongoose');
const { authMiddleWare } = require('./middlewares/authMiddleWare');
const cookieParser = require('cookie-parser')
const cors = require('cors');


const app = express();

app.use(cors({
    origin:'http://localhost:4200', credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(authMiddleWare);
app.use(routs);




mongoose.connect('mongodb://localhost:27017/scStore');
mongoose.connection.on('connected', () => console.log('connected to db'));
app.listen(3000,  ()=> console.log('Server is listening on port 3000'));