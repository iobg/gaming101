'use strict'

const socket = io()

socket.on('connect',()=>console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect',()=>console.log(`Socket disconnected: ${socket.id}`))

const table = document.querySelector('table')
const board=[
	[,,],
	[,,],
	[,,]
]
table.addEventListener('click',event=>{
	const col = event.target.cellIndex
	const row = event.target.parentElement.rowIndex
	board[row][col]='O'
	console.log(board)
	event.target.innerText= 'O'
	console.log(`You clicked on r${row} c${col}`)
})
