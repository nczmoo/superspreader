class Security {
	directions = ['left', 'up', 'right', 'down'];
	x = null;
	y = null;
	looking = null;
	
	constructor(x, y){		
		this.x = x;
		this.y = y;
		this.looking = this.directions[randNum(0, this.directions.length - 1)];
	}
	
	go (){
		let rand = randNum (1, 10);
		this.lookElsewhere();
		
	}

	lookElsewhere(){
		let i = this.directions.indexOf(this.looking);
		i++;
		if (i > this.directions.length - 1){
			i = 0;
		}
		this.looking = this.directions[i];
	}
}