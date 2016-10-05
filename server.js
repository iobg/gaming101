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

const Game = mongoose.model('game',{
	board:[
	[String,String,String],
	[String,String,String],
	[String,String,String]
	],
	nextMove: String
})

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL,()=>{
	server.listen(PORT,()=> console.log('Server is listening on port', PORT))
})
io.on('connect',socket=>{
	Game.create({
		board:[['','',''],['','',''],['','','']],
		nextMove: 'X'
	})
	.then(g=>{
		socket.game=g;
		socket.emit('new game', g)
	})
	.catch(err=>{
		console.error(err)
		socket.emit('error',err)
	})
	socket.on('makeMove',({row,col})=>{
		socket.game.board[row][col]=socket.game.nextMove
		socket.game.nextMove=socket.game.nextMove === 'X' ? 'O' : 'X'
		socket.game.markModified('board')
		socket.game.save().then(g=>{
			socket.emit('move made', g)
		})
		
	})

	socket.on('disconnect',()=>console.log(`Socket disconnected: ${socket.id}`))
})


