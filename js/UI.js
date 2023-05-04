class UI{
	arrows = { down: '&#129059;', left: '&#129056;', right: '&#129058;', up: '&#129057;' };
  constructor(){
    
  }
  refresh(){
	this.displayMap();
	//$("#numOfMasks").html(game.numOfMasks);
	//$("#masked").html("Unmasked");
	if (game.masked){
		//$("#masked").html("Masked");
	}
	$("#coughs").html(game.coughs);
  }
	displayMap(){
		let units = ['', '', 'o', '', '', '', '', '', '', ''];
	  let html = '';
	  for (let y = 0; y < game.maxY; y ++){
		  html += "<div class='y'>";
		  for (let x = 0; x < game.maxX; x ++){
			  let unitClass = '', unit = '';
			  if (game.map[x][y] != 0){
				unitClass = game.unitIDArr[game.map[x][y]];
				unit = units[game.map[x][y]];
			  }
			  if (game.map[x][y] == 3){
				  let security = game.whichSecurity(x, y);
				  unit = this.arrows[security.looking];
			  } else if ( (game.map[x][y] == 5 || game.map[x][y] == 7)){
				  let sheep = game.whichSheep(x, y);
				  unit = this.arrows[sheep.wandering];
			  }
			  html += "<div class='cell " + unitClass + "'>" + unit + "</div>";
		  }
		  html += "</div>";
	  }	  
	  $("#map").html(html);
	}
}
