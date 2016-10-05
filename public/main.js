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

const board=[
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
}

const renderStatus=g=>{
	if(winner(g.board)){
		status.innerHTML = `<h1> ${winner(g.board)} has won </h1>`
		table.removeEventListener('click',tableClick)
	}
	else status.innerText= `${g.nextMove}'s turn`
}

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
}

const tableClick =event=>{
	const col = event.target.cellIndex
	const row = event.target.parentElement.rowIndex
	socket.emit('makeMove',{row,col})

	if(board[row][col]){
		console.log("You can't play there")
	}
	
}

table.addEventListener('click',tableClick)
