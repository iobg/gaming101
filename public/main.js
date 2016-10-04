'use strict'

const socket = io()

socket.on('connect',()=>console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect',()=>console.log(`Socket disconnected: ${socket.id}`))

const board=[
	['','',''],
	['','',''],
	['','','']
]

const drawBoard=(boardState)=>{
	document.querySelector('.board').innerHTML=`
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
const table= document.querySelector('.board')
let nextPlayer = 'X'

table.addEventListener('click',event=>{
	const col = event.target.cellIndex
	const row = event.target.parentElement.rowIndex
	
	if(!board[row][col]){
		board[row][col]=nextPlayer
		nextPlayer= nextPlayer === 'X' ? 'O': 'X'
		drawBoard(board)
	}
	else{
		console.log("You can't play there")
	}
	
})
