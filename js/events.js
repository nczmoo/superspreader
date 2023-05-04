$(document).on('keyup', '', function(e){	
	let keyNames = ['a', 's', 'd', 'w', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
	let directions = ['left', 'down', 'right', 'up', 'left', 'down', 'right', 'up'];
	
	console.log();
	if (keyNames.includes(e.key)){
		let direction = directions[keyNames.indexOf(e.key)];
		game.move('player', direction, null);
	} else if (e.key == ' '){
		if (game.coughs < 1){
			return;
		}
		game.coughs--;
		game.cough(game.player, true);
	}
});

$(document).on('click', '', function(e){

})


$(document).on('click', 'button', function(e){
  ui.refresh()
})
