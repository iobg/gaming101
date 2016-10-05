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
	nextMove: String,
	result:String
})
const winner = b => {
  // Rows
  if (b[0][0] && b[0][0] === b[0][1] && b[0][1] === b[0][2]) {
    return b[0][0]
  } else if (b[1][0] && b[1][0] === b[1][1] && b[1][1] === b[1][2]) {
    return b[1][0]
  } else if (b[2][0] && b[2][0] === b[2][1] && b[2][1] === b[2][2]) {
    return b[2][0]
  }

  // Cols
  else if (b[0][0] && b[0][0] === b[1][0] && b[1][0] === b[2][0]) {
    return b[0][0]
  } else if (b[0][1] && b[0][1] === b[1][1] && b[1][1] === b[2][1]) {
    return b[0][1]
  } else if (b[0][2] && b[0][2] === b[1][2] && b[1][2] === b[2][2]) {
    return b[0][2]
  }

  // Diags
  else if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    return b[0][0]
  } else if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    return b[0][2]
  }
  if(movesRemaining(b)){
  	return "Tie"
  }

  return null
}

const movesRemaining=board=>{
	const MAXLENGTH=26
	const movesMade=board.toString()
	if(movesMade.length >=MAXLENGTH) return true;

}

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL,()=>{
	server.listen(PORT,()=> console.log('Server is listening on port', PORT))
})
const isFinished = game => !!game.result
const spaceTaken = (board,row,col) => !!board[row][col]
const setMove=(game,row,col)=> {

	game.board[row][col] = game.nextMove
	return game.save()
}
const toggleNextMove=game=>{
	 game.nextMove=game.nextMove === '👽' ? '💩' : '👽'
	 return game.save()
}
const setResult = game => {
  const result = winner(game.board)

  if (result) {
    game.toMove = undefined
    game.result = result
  }

  return game.save()
}
const makeMove=(socket,row,col)=>{
	if(isFinished(socket.game)){
			return;
		}
		if(spaceTaken(socket.game.board,row,col)){
			return;
		}
		setMove(socket.game,row,col)
		toggleNextMove(socket.game)
		setResult(socket.game,result)

		socket.game.markModified('board')
		socket.game.save().then(g=>{
			socket.emit('move made', g)
		})
}

const result=undefined;
io.on('connect',socket=>{
	Game.create({
		board:[['','',''],['','',''],['','','']],
		nextMove: '👽'
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
		makeMove(socket,row,col)
	})

	socket.on('disconnect',()=>console.log(`Socket disconnected: ${socket.id}`))
})


