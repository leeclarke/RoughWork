/**
 * GameEngine runs the show, this is the game controller.
 */
function GameEngine(){
	
}
GameEngine.CANVAS_WIDTH = 0;
GameEngine.CANVAS_HEIGHT = 0;
GameEngine.STATUS_WIDTH = 0;
GameEngine.playerDefaltVisonRange = 5;
GameEngine.DisplayGrid = false;
GameEngine.lightsOn = false; //Toggles visability, true makes whole map explored.
GameEngine.showPlayerStatus = true;
GameEngine.elapsed = 0;
GameEngine.lastUpdate = 0;
GameEngine.buttonStates = [];
GameEngine.player = {};
GameEngine.monsters = [];
GameEngine.eventMesgsStack = [];
GameEngine.currentMap = null;

GameEngine.addEventMessage = function(msg,life) {
	if(msg) {
		life = (life || life == null)?60:life;
		this.eventMesgsStack.push({"msg":msg, "life":life})
	}
}


/**
 * Move the monsters if they can move, also updates visability
 */
GameEngine.moveMonsters = function() {
	mover = new Mover();
	for(m = 0; m < this.monsters.length; m++) {		
		this.checkMonsterVisability(m);
		mover.moveMonster(this.monsters[m],this.player);
	}	
}

/**
 * Check to see if monster is in players sight and sets monsters visable value acordingly.
 */
GameEngine.checkMonsterVisability = function(m) {
	area = this.getPlayerVisableArea();
	this.monsters[m].visable = this.inRange(this.monsters[m], area);
}

/**
 * Responsable for rendering the ViewPort or Camera of the game.
 */
GameEngine.render = function() {
	vpX = (this.CANVAS_WIDTH/2)-(this.currentMap.getTileWidth()/2); //viewPort Center.
	vpY = (this.CANVAS_HEIGHT/2)-(this.currentMap.getTileHeight()/2);
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT ) ;
	this.renderViewPort(context, vpX,vpY); 
}

/**
 * Paints the game map then centers the viewport on the player sprite.
 *
 * @param contest - ViewPort's 2D context
 * @param vpCtrX - ViewPort's center X position, adjusted to the UL corner of the center player tile.
 * @param vpCtrY - ViewPort's center Y position, adjusted to the UL corner of the center player tile.
 */
GameEngine.renderViewPort = function(context, vpCtrX, vpCtrY) {
	renderedMap = GameEngine.currentMap.renderMap();
	context.save();  //save position to return to later.
	context.translate(vpCtrX-GameEngine.player.x,vpCtrY-GameEngine.player.y); //Move to point on map where player stands
	context.drawImage(renderedMap, 0, 0);

	//Draw monsters
	for(m = 0; m < GameEngine.monsters.length; m++){
		if(GameEngine.monsters[m].visable == false) {
			continue;
		}
		context.drawImage(GameEngine.monsters[m].renderImg(), GameEngine.monsters[m].x, GameEngine.monsters[m].y);
	}

	if(this.DisplayGrid) {
		paintGrid(context, renderedMap.width, renderedMap.height);
	}
	context.restore(); //pop the canvas back to where it was which moves the map.
	this.buildStatusDisplay(context);
	this.writeStatus(context);
	
	context.drawImage(GameEngine.player.renderImg(), vpX, vpY); //Draws player sprite in the middle of VP
}

GameEngine.writeStatus = function(context) {
	statusMargin = 5;
	statusHeight = 100;

	//position in upper left corner	
	context.save();
	context.translate(0,0);
	
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	context.lineWidth = "0.5";

	//drawFrame
	context.strokeRect(this.STATUS_WIDTH+statusMargin,statusMargin,(this.CANVAS_WIDTH-10-this.STATUS_WIDTH),statusHeight-10);
	context.fillStyle = "rgba(204, 204, 204, 0.1)";
	context.fillRect(this.STATUS_WIDTH+statusMargin,statusMargin,(this.CANVAS_WIDTH-10-this.STATUS_WIDTH),statusHeight-10);
	context.fillStyle = "#FFFF33";	
	msgCt = 1;
	vertPosStart = 20;
	//context.fillText("TEST2", STATUS_WIDTH+(statusMargin*2), 30);
	//while(GameEngine.length >0) {
	for(m = 0; m < GameEngine.eventMesgsStack.length ;m++)	{
		//e = GameEngine.eventMesgsStack.pop();
		e = GameEngine.eventMesgsStack[m];
		context.fillText(e.msg, this.STATUS_WIDTH+statusMargin, vertPosStart*msgCt);	
		if(e.life > 0) {
			e.life--;
		} else {
			GameEngine.eventMesgsStack.splice(m,1);
		}
		msgCt++;	
	}
	
	context.restore();
}

/**
 * Draws the status display overlay. 
 */
GameEngine.buildStatusDisplay = function(context) {
	//position in upper left corner	
	if(GameEngine.showPlayerStatus) {
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
		context.fillText("Col:"+GameEngine.player.getCol()+" Row:"+GameEngine.player.getRow(), 8, 100);
		
		context.restore();
	}
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
 * Checks 2 entities to see if they have collided.
 */
GameEngine.checkCollision = function(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

/**
 * See if an entity is with-in a given area 
 * 
 * @entity - object created from EntityMaanger with location component.
 * @area - defined area with upperLeft and bottomRight positions.  ex. {"upperLeft":{"row":0,"col":0},"bottomRight":{"row":0,"col":0}}
 * @return - true if entity lies with-in area  
 */
GameEngine.inRange = function(entity, area) {
	if(area.upperLeft.row <= entity.getRow() && area.bottomRight.row >= entity.getRow()) {
			if(area.upperLeft.col <= entity.getCol() && area.bottomRight.col >= entity.getCol())
				return true;
	}
	return false;
}

/**
 * Simple helper to simplify the retrival of the players visable area. 
 */
GameEngine.getPlayerVisableArea = function() {
	return this.currentMap.getSurroundingTiles(this.player.getRow(),this.player.getCol(),this.player.vision,this.player.vision);
}

/****Array mods. ******?

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
