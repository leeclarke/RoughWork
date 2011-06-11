/**
 * GameEngine runs the show, this is the game controller.
 */
function GameEngine(){
	
};

GameEngine.debugOn = false;
GameEngine.CANVAS_WIDTH = 0;
GameEngine.CANVAS_HEIGHT = 0;
GameEngine.ViewPortCenterX = 0;
GameEngine.ViewPortCenterY = 0;
GameEngine.STATUS_WIDTH = 0;
GameEngine.playerDefaltVisonRange = 5;
GameEngine.DisplayGrid = false;
GameEngine.lightsOn = false; //Toggles visability, true makes whole map explored.
GameEngine.showPlayerStatus = true;
GameEngine.elapsed = 0;
GameEngine.lastUpdate = 0;
GameEngine.lastUpdateTime = 0;
GameEngine.fps = 0;
GameEngine.buttonStates = [];
GameEngine.player = {};
GameEngine.monsters = [];
GameEngine.eventMesgsStack = [];
GameEngine.currentMap = null;
GameEngine.mouseQueue = [];
GameEngine.dblClickTimeLimit = 8000;
GameEngine.lastMouseEvent = 0; //in ms
GameEngine.watchedMouseEvents = [];

/**
 * Adds Messages to the Message queue to display to player.
 */
GameEngine.addEventMessage = function(msg,life) {
	if(msg) {
		life = (life || life == null)?60:life;
		this.eventMesgsStack.push({"msg":msg, "life":life})
	}
};


/**
 * Move the monsters if they can move, also updates visability
 */
GameEngine.moveMonsters = function() {
	mover = new Mover();
	for(m = 0; m < this.monsters.length; m++) {		
		this.checkMonsterVisability(m);
		mover.moveMonster(this.monsters[m],this.player);
	}	
};

/**
 * Check to see if monster is in players sight and sets monsters visable value acordingly.
 */
GameEngine.checkMonsterVisability = function(m) {
	area = this.getPlayerVisableArea();
	this.monsters[m].visable = this.inRange(this.monsters[m], area);
};

/**
 * Responsable for rendering the ViewPort or Camera of the game.
 */
GameEngine.render = function() {
	vpX = (this.CANVAS_WIDTH/2)-(this.currentMap.getTileWidth()/2); //viewPort Center.
	vpY = (this.CANVAS_HEIGHT/2)-(this.currentMap.getTileHeight()/2);
	GameEngine.ViewPortCenterX = vpX;
	GameEngine.ViewPortCenterY = vpY;
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT ) ;
	this.renderViewPort(context, vpX,vpY); 
};

/**
 * Paints the game map then centers the viewport on the player sprite.
 *
 * @param contest - ViewPort's 2D context
 * @param vpCtrX - ViewPort's center X position, adjusted to the UL corner of the center player tile.
 * @param vpCtrY - ViewPort's center Y position, adjusted to the UL corner of the center player tile.
 */
GameEngine.renderViewPort = function(context, vpCtrX, vpCtrY) {
	var now = new Date().getTime();
	GameEngine.elapsed = (now - this.lastUpdate);
	GameEngine.fps = ~~(1000/(now - GameEngine.elapsed));
	GameEngine.lastUpdateTime = now;
	renderedMap = GameEngine.currentMap.renderMap();
	context.save();  //save position to return to later.
	context.translate(vpCtrX-GameEngine.player.x,vpCtrY-GameEngine.player.y); //Move to point on map where player stands
	context.drawImage(renderedMap, 0, 0);

	//Draw monsters
	for(m = 0; m < GameEngine.monsters.length; m++){
		if(GameEngine.monsters[m].visable == false) {
			continue;
		}		
		GameEngine.monsters[m].renderImg(context,GameEngine.monsters[m].x, GameEngine.monsters[m].y);
	}

	if(this.DisplayGrid) {
		paintGrid(context, renderedMap.width, renderedMap.height);
	}
	context.restore(); //pop the canvas back to where it was which moves the map.
	this.buildStatusDisplay(context);
	this.writeStatus(context);
	GameEngine.player.renderImg(context, vpCtrX, vpCtrY);
};

/**
 * Displays the Messages overlay at the top of the viewPort, it doesnt display if no messages.
 */
GameEngine.writeStatus = function(context) {
	var vertPosStart = 20;
	var statusMargin = 5;
	var statusHeight = vertPosStart*GameEngine.eventMesgsStack.length + vertPosStart;
	if(GameEngine.eventMesgsStack.length === 0) {
		//nothing to display
		return;
	}
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
	var msgCt = 1;
	
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
};

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
		context.fillText("Col: "+GameEngine.player.getCol()+" Row: "+GameEngine.player.getRow(), 8, 100);
		context.fillText("fps: "+GameEngine.fps,8, 120);
		context.fillText("ctPt-x: "+ ~~(GameEngine.ViewPortCenterX),8, 140);
		context.fillText("ctPt-y: "+ ~~(GameEngine.ViewPortCenterY),8, 160);
		var upperLeft = this.getMapUpperLeftPosition();
		context.fillText("mapPt-x: "+ upperLeft.x,8, 180);
		context.fillText("mapPt-y: "+ ~~(upperLeft.y),8, 200);
		context.restore();
	}
};

/**
 * Computes the upper Left corner of the map which will rarely be 0,0. THis can be used to determine
 * click locations relative to the map.
 * @return the usual point response. {"x":0,"y":0}
 */
GameEngine.getMapUpperLeftPosition = function() {
	var ulX = GameEngine.ViewPortCenterX - GameEngine.player.x;
	var ulY = GameEngine.ViewPortCenterY - GameEngine.player.y;
	return {"x":ulX, "y":ulY};
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
};

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
};

/**
 * Simple helper to simplify the retrival of the players visable area. 
 */
GameEngine.getPlayerVisableArea = function() {
	return this.currentMap.getSurroundingTiles(this.player.getRow(),this.player.getCol(),this.player.vision,this.player.vision);
};

/**
 * To make this work you would register an Objects events
 *From http://www.geekdaily.net/2008/04/02/javascript-defining-and-using-custom-events/
 */
GameEngine.CustomEvent = function() {
	//name of the event
	this.eventName = arguments[0];
	var mEventName = this.eventName;

	//function to call on event fire
	var eventAction = null;

	//subscribe a function to the event
	this.subscribe = function(fn) {
		eventAction = fn;
	};

	//fire the event
	this.fire = function(sender, eventArgs) {
		//this.eventName = eventName2; //Not needed?
		if(eventAction != null) {
			eventAction(sender, eventArgs);
		}
		else {
			alert('There was no function subscribed to the ' + mEventName + ' event!');
		}
	};
};

/**
 * Adds additional CustomeEvents to the listener queue which responds to mouse events.
 */
GameEngine.addMouseEventListener = function(custEvent) {
	if(custEvent && custEvent !== null) {
		this.watchedMouseEvents.push(custEvent);
	}
}

/**
 * 
 */
GameEngine.processMouseEvents = function(mouseEvent){
	for(e = 0 ; e < watchedEvents.length; e++) {
			this.watchedEvents[e].fire(null, {message: eventTestMsg + " " + watchedEvents[e].eventName, event: mouseEvent});
	}
}

/**
 * Debug method to display debug in game.
 */
GameEngine.debug = function(source, msg) {
	if(GameEngine.debugOn){
		GameEngine.addEventMessage("["+source+"] "+msg);
	}
}
/****Array mods. These dont actually attach to the Array object..******/

/**
 * Select random item from an Array.
 */
Array.prototype.ramdomItem =  function(){	
	return this[GameEngine.randomInt(0, this.length - 1)];
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
};
