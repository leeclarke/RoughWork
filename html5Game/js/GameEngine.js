/**
 * GameEngine runs the show, this is the game controller.
 */
function GameEngine(){
	
}
GameEngine.CANVAS_WIDTH = 0;
GameEngine.CANVAS_HEIGHT = 0;
GameEngine.STATUS_WIDTH = 0;
GameEngine.DisplayGrid = false;
GameEngine.player = {};
GameEngine.monsters = [];
GameEngine.eventMesgsStack = [];

GameEngine.moveMonsters = function() {
	mover = new Mover();
	for(m = 0; m < this.monsters.length; m++) {
		mover.moveMonster(this.monsters[m],this.player);
	}	
}

/**
 * Responsable for rendering the ViewPort or Camera of the game.
 */
GameEngine.render = function() {
	vpX = (this.CANVAS_WIDTH/2)-(tileWidth/2); //viewPort Center.
	vpY = (this.CANVAS_HEIGHT/2)-(tileHeight/2);
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT ) ;
	this.renderViewPort(context, theMap, vpX,vpY); 
}

/**
 * Paints the game map then centers the viewport on the player sprite.
 *
 * @param contest - ViewPort's 2D context
 * @param vpCtrX - ViewPort's center X position, adjusted to the UL corner of the center player tile.
 * @param vpCtrY - ViewPort's center Y position, adjusted to the UL corner of the center player tile.
 */
GameEngine.renderViewPort = function(context, theMap, vpCtrX, vpCtrY) {
	context.save();  //save position to return to later.
	context.translate(vpCtrX-GameEngine.player.x,vpCtrY-GameEngine.player.y); //Move to point on map where player stands
	context.drawImage(theMap, 0, 0);

	//Draw monsters
	for(m = 0; m < GameEngine.monsters.length; m++){
		context.drawImage(GameEngine.monsters[m].renderImg(), GameEngine.monsters[m].x, GameEngine.monsters[m].y);
	}

	if(this.DisplayGrid) {
		paintGrid(context, theMap.width, theMap.height);
	}
	context.restore(); //pop the canvas back to where it was which moves the map.
	this.buildStatusDisplay(context);
	this.writeStatus(context);
	
	context.drawImage(GameEngine.player.renderImg(), vpX, vpY); //Draws player sprite in the middle of VP
}

GameEngine.writeStatus = function(context) {
	statusMargin = 5;
	statusHeight = 150;

	//position in upper left corner	
	context.save();
	context.translate(0,0);
	
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	context.lineWidth = "0.5";

	//drawFrame
	context.strokeRect(this.STATUS_WIDTH+statusMargin,statusMargin,(this.CANVAS_WIDTH-10-this.STATUS_WIDTH),statusHeight-10);
	context.fillStyle = "rgba(204, 204, 204, 0.1)";
	context.fillRect(6,6,(this.STATUS_WIDTH-12),this.CANVAS_HEIGHT-12);
	context.fillStyle = "#FFFF33";	
	msgCt = 1;
	vertPosStart = 20;
	//context.fillText("TEST2", STATUS_WIDTH+(statusMargin*2), 30);
	while(GameEngine.eventMesgsStack.length >0) {
		e = GameEngine.eventMesgsStack.pop();
		context.fillText(e, this.STATUS_WIDTH+statusMargin, vertPosStart*msgCt);	
		msgCt++;	
	}
	
	context.restore();
}

/**
 * Draws the status display overlay. 
 */
GameEngine.buildStatusDisplay = function(context) {
	//position in upper left corner	
	context.save();
	context.translate(0,0);
	
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	context.lineWidth = "0.5";

	//drawFrame
	context.strokeRect(5,5,(this.STATUS_WIDTH-10),this.CANVAS_HEIGHT-10);
	context.fillStyle = "rgba(204, 204, 204, 0.1)";
	context.fillRect(6,6,(this.STATUS_WIDTH-12),this.CANVAS_HEIGHT-12);
	
	//Write some text for Debugging
	context.fillStyle = "#FFFF33"; // Set color to black
	context.fillText(GameEngine.player.name, 8, 20);
	context.fillText("HP: "+GameEngine.player.hp, 8, 40);
	context.fillText("AC: "+GameEngine.player.getArmor(), 8, 60);
	context.fillText("x:"+GameEngine.player.x+" y:"+GameEngine.player.y, 8, 80);
	
	context.restore();
}

/**
 * Generate rnd number between 2 numbers including the from and to values.
 */
GameEngine.randomInt = function(from, to) {
   return Math.floor(Math.random() * (to - from + 1) + from);
};

/**
 * Random number gen that simulates dice rolls just for simple understanding..
 */
GameEngine.diceRoll = function( sides, numDice) {
	return this.randomInt(sides, sides*numDice);       
};

/**
 * Select random item from an Array.
 */
Array.prototype.ramdomItem =  function(){	
	return this[this.randomInt(0, this.length - 1)];
};

/**
 * Find an object location in an Array.
 */
Array.prototype.indexOf = function (vItem) {
    for (var i=0; i < this.length; i++) {
        if (vItem == this[i]) {
            return i;
        }    }
    return -1;
}
