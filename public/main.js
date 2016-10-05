'use strict'

const socket = io()
let board;
socket.on('connect',()=>console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect',()=>console.log(`Socket disconnected: ${socket.id}`))
socket.on('error',console.error)
socket.on('new game', game=>{
	render(game)
	board=game.board
})
socket.on('move made', game=>{
	render(game)
})

const table= document.querySelector('.board')
const status = document.querySelector('.status')

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
	socket.emit('makeMove',{row,col})
}
table.addEventListener('click',tableClick)
