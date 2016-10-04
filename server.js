'use strict'

const express = require('express');
const app = express();
const { Server } = require('http')
const server = Server(app)
const mongoose = require('mongoose')
const io = require('socket.io')(server)

const PORT = process.env.port || 3000
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/tictactoe'
app.set('view engine','pug')
app.use(express.static('public'))
app.get('/',(req,res)=>{
	res.render('index')
})

mongoose.connect(MONGODB_URL,()=>{
	server.listen(PORT,()=> console.log('Server is listening on port', PORT))
})
