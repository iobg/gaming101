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


const table= document.querySelector('.board')
let nextPlayer = 'X'

table.addEventListener('click',event=>{
	const col = event.target.cellIndex
	const row = event.target.parentElement.rowIndex

	if(board[row][col]){
		console.log("You can't play there")
	}
	else{
		board[row][col]=nextPlayer
		nextPlayer= nextPlayer === 'X' ? 'O': 'X'
		drawBoard(board)
	}
	if(winner(board)){
		console.log(`${winner(board)} has won`)
	}
	
})
