class Sheep{
	coughing = false;
	directions = ['left', 'up', 'right', 'down'];
	mask = null;
	wandering = null;
	x = null;
	y = null;	
	
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.mask = randNum(0, 2);
		this.wandering = this.directions[randNum(0, this.directions.length - 1)];
		
	}
	
	go(){
		let rand = randNum(1, 15);
		if (rand == 1){
			this.coughing = true;
		}

	}
	
	wanderElse (){
		let i = this.directions.indexOf(this.wandering);
		i++;
		if (i > this.directions.length - 1){
			i = 0;
		}
		this.wandering = this.directions[i];
	}
}