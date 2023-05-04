class Game{
	coughs = 3;
	cloudDeathDelay = 1000;
	
	clouds = [];
	directions = { down: {axis: 'y', n: 1}, left: { axis: 'x', n: -1 }, 
		right: { axis: 'x', n: 1 }, up: { axis: 'y', n: -1} }
	gameEnded = false;
	gameLoop = null;
	infectables = [3, 5];
	map = [];
	masked = false;
	maxX = 30;
	maxY = 20;
	numOfMasks = 3;
	numOfSecurity = 10;
	numOfSheep = 100;
	numOfWallSeeds = 20;
	passableSpaces = [0, 4, 6, 8, 9];
	player = {
		x: 0, 
		y: 0,
	};
	security = [];
	sheep = [];
	tickRate = 1500;
	ticks = 0;
	unitIDArr = [
		null, 				//0
		'wall', 			//1
		'player', 			//2
		'security', 		//3
		'securityLooking', 	//4
		'sheep', 			//5
		'cough',			//6
		'infectedSheep',	//7
		'lookTrail',		//8
		'cleanCough',		//9
	];
	
  constructor(){
    for (let x = 0; x < this.maxX; x++){
		let arr = [];
		for (let y = 0; y < this.maxY; y++){
			arr.push (0);
		}
		this.map.push(arr);
	}
	this.map[this.player.x][this.player.y] = 2;
	this.createWalls();
	for (let i = 0; i < this.numOfSecurity; i ++){
		let empty = this.fetchEmptySpace('security');		
		this.security.push(new Security(empty.x, empty.y));
		this.map[empty.x][empty.y] = this.unitIDArr.indexOf('security');
	}
	for (let i = 0; i < this.numOfSheep; i++){
		let empty = this.fetchEmptySpace();		
		this.sheep.push(new Sheep(empty.x, empty.y));
		this.map[empty.x][empty.y] = this.unitIDArr.indexOf('sheep');
	}
	this.securityLooks();
	this.gameLoop = setInterval(this.loop, this.tickRate);
  }

	cough(where, infected){		
		for (let x = where.x - 1; x < where.x + 2; x ++){
			for (let y = where.y - 1; y < where.y + 2; y ++){				
				if ( (x == where.x && y == where.y) || this.isItOutBounds( { x: x, y: y} )){
					//console.log('nah');
					continue;
				} else if (infected && this.infectables.includes(this.map[x][y])){
					//console.log('infect');
					this.infect(x, y);
				} else if (this.passableSpaces.includes(this.map[x][y])){
					
					this.clouds.push({start: Date.now() + randNum(0, this.cloudDeathDelay), x: x, y: y} );					
					if (this.map[x][y] == 0){
						this.map[x][y] = 9;
					}
					if (infected){
						this.map[x][y] = 6;
					}
				}
			}
		}
		
		ui.refresh();		
	}
	
	clearClouds (){
		for (let i in this.clouds){
			let cloud = this.clouds[i];
			if (Date.now() - this.clouds[i].start > this.cloudDeathDelay){
				if (this.map[cloud.x][cloud.y] == 6 || this.map[cloud.x][cloud.y] == 9){
					this.map[cloud.x][cloud.y] = 0;
				}
				this.clouds.splice(i, 1);
			}
		}
	}
	cloudsDrift(){
		for (let i in this.clouds){
		
		}
	}
	createLookTrail(startX, startY){	
		let hX = startX, hY = startY, vX = startX, vY = startY, vI = 0, hI = 0, vActive = true, hActive = true ;
		let going = [-1, 1];
		
		while (1){
			hX += going[hI];
			vY += going[vI];
			let hOut = this.isItOutBounds( { x: hX, y: hY });
			let vOut = this.isItOutBounds({ x: vX, y: vY });
			if (hActive && !hOut && (this.map[hX][hY] == 0)){				
				this.map[hX][hY] = 8;				
			} else if (hActive && (hOut || (!hOut && this.map[hX][hY] == 1))) {
				hI++;
				hX = startX;
				if (hI > going.length -1){
					hActive = false;
				}
			} 
			
			if (vActive && !vOut && this.map[vX][vY] == 0){
				this.map[vX][vY] = 8;
			} else if (vActive && (vOut || (!vOut && this.map[vX][vY] == 1))) {
				vI++;
				vY = startY;
				if (vI > going.length -1){
					vActive = false;
				}
			}
			if (!vActive && !hActive){
				return;
			}

		}
	}
  createWalls(){
	  for (let i = 0; i < this.numOfWallSeeds; i ++){		  
			let going = true;
			let goVertical = randNum(1, 2) == 1;
			let where = this.fetchCleanSpace();
			let nextWhere = {x : where.x, y: where. y };
			this.map[where.x][where.y] = 1;			
			while (going){
				
				if (goVertical){
					where.y++;
					nextWhere.y += 2;
				} else {
					where.x++;
					nextWhere.x += 2;
				}
				if (where.x > this.maxX - 1 || where.y > this.maxY - 1
					|| nextWhere.x > this.maxX - 1 || nextWhere.y > this.maxY - 1 
					|| this.map[where.x][where.y] != 0 ){
					break;
				} else if (this.map[where.x][where.y] == 0 && this.map[nextWhere.x][nextWhere.y] != 0){					
					going = false;
				}
				this.map[where.x][where.y] = 1;
			}
			
	  }
  }

  fetchCleanSpace(){
	  let fetching = true;
	  while (fetching){		  		    		 
			let rand = this.fetchEmptySpace();
		  if (this.isItClean(rand)){
			  return rand;
		  }
	  }
  }

  fetchEmptySpace(what){
	  let fetching = true;
	  while(fetching){
		  let randX = randNum(0, this.maxX - 1), randY = randNum(0, this.maxY - 1);
		  if (what == 'security' && (randX < 2 || randY < 2)){
			continue;  
		  } else if (this.map[randX][randY] == 0){
			  return { x: randX, y: randY };
		  }
	  }
  }

	gameOver(what){
		this.stop();
		if (what =='security'){			
			ui.refresh();
			alert("Security spotted you!");			
			return;
		}
		this.ticks = 0;
		this.gameLoop = setInterval(this.loop, this.tickRate / 10);
	}

	howManyInfected(){
		let n = 0;
		for (let sheep of this.sheep){
			if (sheep.infected){
				n++;
			}
		}
		return n + "/" + this.sheep.length + " infected. (" + n / this.sheep.length * 100 + "%)";
	}

	infect(x, y){
		if (this.map[x][y] == this.unitIDArr.indexOf('sheep')){
			for(let i in this.sheep){
				let sheep = this.sheep[i];
				if(!sheep.infected && sheep.x == x && y == sheep.y){					
					this.sheep[i].infected = true;
					this.map[sheep.x][sheep.y] = 7;
				}
			}
		}
		
	}
  isItClean(rand){
	let bad = false;
	let mapX = this.maxX - 1, mapY = this.maxY - 1;
	for (let x = rand.x - 1; x <= rand.x; x ++){		
		for (let y = rand.y - 1; y <= rand.y; y ++){
			if (x == rand.x && y == rand.y
				|| (x > mapX || y > mapY || x < 0 || y || 0 )){
				continue;
			} else if (this.map[x][y] != 0){									
				return false;				
			}
		}  
	}
	return true;
  }

  isItOutBounds(where){
	  return (where.x > this.maxX - 1 || where.y > this.maxY - 1 || where.x < 0 || where.y < 0);		  
  }
  
  
  loop(){
	  game.clearClouds();
	  game.sheepWander();	  
	  game.securityLooks();
	  
	  ui.refresh();	  
	  if (game.gameEnded == 'security'){
		  
		 game.gameOver('security');
	  }
	  game.ticks++;	  
	  if (game.gameEnded != false && game.ticks >= 60){
		  game.stop();
		  alert(game.howManyInfected());
	  }
	  
	  if (game.gameEnded == false && game.coughs < 1){
		  game.gameOver('coughs');
	  }
  }
  move (unit, dir, unitID){	  
	let pos = null;	
	let posUnit = unit;
	if (unit == 'infectedSheep'){
		posUnit  = 'sheep';
	}
	let direction = this.directions[dir];
	let moving = {x: 0, y: 0};	
	
	moving[direction.axis] += direction.n	
	pos = this[posUnit];
	if (unitID != null){
		pos = this[posUnit][unitID];
	}	
	let movingTo = { x: pos.x + moving.x, y: pos.y + moving.y };	

	if (this.isItOutBounds(movingTo)){
		return;
	}  if (unit == 'player' && this.map[movingTo.x][movingTo.y] == 4){
		this.gameOver('security');

	} else if (!this.passableSpaces.includes(this.map[movingTo.x][movingTo.y])){
		//interaction
		return;
	}

	this.map[pos.x][pos.y] = 0;
	if (unitID == null){
		this[posUnit].x = movingTo.x;
		this[posUnit].y = movingTo.y;
	} else {
		this[posUnit][unitID].x = movingTo.x;
		this[posUnit][unitID].y = movingTo.y;
	}
	
	this.map[movingTo.x][movingTo.y] = this.unitIDArr.indexOf(unit);
	if (unit == 'sheep' && this.map[movingTo.x][movingTo.y] == 6){
		this.infect(x, y);
	}
	ui.refresh();
  }
  
	reset(what){
		for (let x = 0; x < this.maxX; x ++){
			for (let y = 0; y < this.maxY; y ++){
				if (this.map[x][y] == what){
					this.map[x][y] = 0;
				}
			}
		}
	}
  
  securityLooks(){
	this.reset(4);
	for (let i in this.security){			
			this.security[i].go();

			let direction = this.directions[this.security[i].looking];
			let where = { x: this.security[i].x, y: this.security[i].y };
			let n = 0;
			this.createLookTrail(this.security[i].x, this.security[i].y);
			while (1){														
				where[direction.axis] += direction.n;
				
				if (this.isItOutBounds(where)){
					break;
				} else if (this.map[where.x][where.y] == 2){
					
					this.gameEnded = 'security';
					break;
				} else if (!this.passableSpaces.includes(this.map[where.x][where.y])  ){
					break;
				} 
				
				if (this.map[where.x][where.y] == 8){
					this.map[where.x][where.y] = this.unitIDArr.indexOf('securityLooking');
					n++;
				}
			}


	  }
  }
  
  sheepWander(){
	  for (let i in this.sheep){	
			this.sheep[i].go();
			if (this.sheep[i].coughing){
				this.cough({ x: this.sheep[i].x, y: this.sheep[i].y }, this.sheep[i].infected);
				this.sheep[i].coughing = false;
			}
			let sheepClass = 'sheep';
			if (this.sheep[i].infected){
				sheepClass = 'infectedSheep';
			}
			this.move(sheepClass, this.sheep[i].wandering, i);
			let direction = this.directions[this.sheep[i].wandering];
			let where = {x: this.sheep[i].x, y: this.sheep[i].y };
			where[direction.axis] += direction.n;
			
			if (this.isItOutBounds(where) 
				|| !this.passableSpaces.includes(this.map[where.x][where.y])){
				this.sheep[i].wanderElse();
			}
			
	  }
  }
  stop(){
	  	clearInterval(this.gameLoop);
		this.gameLoop = null;
		this.gameEnded = true;
  }
  
  whichSecurity(x, y){
	  for(let i in this.security){
		  if (this.security[i].x == x && this.security[i].y == y){
			return this.security[i];  
		  }		  
	  }
	  return null;
  }
  
  whichSheep(x, y){
	  for(let i in this.sheep){
		  if (this.sheep[i].x == x && this.sheep[i].y == y){
			return this.sheep[i];  
		  }		  
	  }
	  return null;
  }
}
