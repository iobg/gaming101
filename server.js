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
//routes
app.get('/',(req,res)=>{
	res.render('home')
})

app.get('/game',(req,res)=>{
	res.render('index', {games:[{_id:123}, {_id:124}, {_id:125}]})
})

app.get('/game/create',(req,res)=>{
	Game.create({
		board:[['','',''],['','',''],['','','']],
		nextMove: '👽'
	})
	.then(game=>{
		res.redirect(`/game/${game._id}`)
	})
})

app.get('/game/:id',(req,res)=>{
	res.render('game')
})

//game logic
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
const isFinished = game => !!result
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
	Game.findById(socket.gameId)
	.then(game=>{
		if(isFinished(game)){
			return;
		}
		if(spaceTaken(game.board,row,col)){
			return;
		}
		setMove(game,row,col)
		toggleNextMove(game)
		setResult(game,result)

		game.markModified('board')
		game.save()
		.then(g=>{
			socket.join(game._id)
			io.to(game.id).emit('move made', g)
		})

	})
	
}

const result=undefined;
io.on('connect',socket=>{
	const id = socket.handshake.headers.referer.split('/').slice(-1)[0]
	Game.findById(id)
	.then(g=>{
		socket.join(g._id)
		socket.gameId=g.id;
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


