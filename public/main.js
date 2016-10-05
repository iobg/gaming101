'use strict'

const socket = io()

socket.on('connect',()=>console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect',()=>console.log(`Socket disconnected: ${socket.id}`))
socket.on('error',console.error)
socket.on('new game', game=>{
	render(game)
})
socket.on('move made', game=>{
	render(game)
})

let board=[
	['','',''],
	['','',''],
	['','','']
]
const table= document.querySelector('.board')
const status = document.querySelector('.status')
let nextPlayer = 'X'

const render=game=>{
	renderStatus(game);
	drawBoard(game.board)
	board=game.board
}

const renderStatus=g=>{
	if(g.result){
		status.innerHTML = `${g.result} has won`
		table.removeEventListener('click',tableClick)
	}
	else status.innerText= `${g.nextMove}'s turn`
}

const drawBoard=(boardState)=>{
	table.innerHTML=`
	<table>
		<tr>
			<td>${boardState[0][0]}</td>
			<td>${boardState[0][1]}</td>
			<td>${boardState[0][2]}</td>
		</tr>
		<tr>
			<td>${boardState[1][0]}</td>
			<td>${boardState[1][1]}</td>
			<td>${boardState[1][2]}</td>
		</tr>
		<tr>
			<td>${boardState[2][0]}</td>
			<td>${boardState[2][1]}</td>
			<td>${boardState[2][2]}</td>
		</tr>
	</table>
	`
}

const tableClick =event=>{
	const col = event.target.cellIndex
	const row = event.target.parentElement.rowIndex
	if(board[row][col]){
		console.log("You can't play there")
	}
	else{
		socket.emit('makeMove',{row,col})
	}
}

table.addEventListener('click',tableClick)
