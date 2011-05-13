var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;
var showGrid = true;
var player;
var theMap;
var context;

/**
 * WindowReady used for starting up the game prototype.
 *
 * This simulates an actual game client
 */
function windowReady() {
	//Create canvas
	var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
	context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	//Set up background.
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	
	tileWidth = 32;
	tileHeight = 32;
	tiledMap = new TiledMap(CANVAS_WIDTH+300,CANVAS_HEIGHT+300,tileWidth,tileHeight);

	//add fake player sprite, centerd in middle of screen
	playerImage = document.createElement('img');
	playerImage.src = "res/player.png";

	testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]}
	
	tileMapManager = new SpriteTileManager(testManagerConfig);

	tiledMap.tiles = [
				[{},{}],
				[{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{"id":1, "type":1},{"id":2, "type":2},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{},{},{},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{},{},{},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{},{},{},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{},{},{},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{},{},{},{},{},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}]

		];
	tiledMap.tileMapManager = tileMapManager;
	
	theMap = tiledMap.renderMap();
	//draw to canvas	

	player = new Player("Test",playerImage);
	player.x = 128;
	player.y = 64;
	//renderViewPort(context, theMap, player, vpX,vpY);  
	
	render();
}

window.onload = windowReady;

/**
 * Responsable for rendering the ViewPort or Camera of the game.
 */
function render() {
	vpX = (CANVAS_WIDTH/2)-(tileWidth/2); //viewPort Center.
	vpY = (CANVAS_HEIGHT/2)-(tileHeight/2);
	console.log("vpX ="+vpX +" vpY=" +vpY )
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	renderViewPort(context, theMap, player, vpX,vpY);  
}

//TODO: REMOVE this is for testing only,  with out running a game loop.  add key_status.js to html page for actual support.
$(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
    fakeLoop();
  });
  
  $(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
    fakeLoop(); //Forcing an update outside of thread loop
  });
});

function fakeLoop() {
	update();
	render();
}
//REMOVE: TESTING only


/**
 * Update player postion based on input.
 */
function update() {
	mover = new Mover();
  if (keydown.left) {
    //player.x -= 32; //TODO: implement a Mover that handles collision.
    mover.movePlayer(player, -32,0);
  }

  if (keydown.right) {
    //player.x += 32;
    mover.movePlayer(player, 32,0);
  }
  
  if (keydown.up) {
      //player.y -= 32;
      mover.movePlayer(player, 0,-32);
  }
  
  if (keydown.down) {
        //player.y += 32;
        mover.movePlayer(player, 0,32);
  }
}

/**
 * Paints the game map then centers the viewport on the player sprite.
 *
 * @param contest - ViewPort's 2D context
 * @param palyer  - Player object which contains players map location.
 * @param vpCtrX - ViewPort's center X position, adjusted to the UL corner of the center player tile.
 * @param vpCtrY - ViewPort's center Y position, adjusted to the UL corner of the center player tile.
 */
function renderViewPort(context, theMap, player, vpCtrX, vpCtrY) {
	context.save();  //save position to return to later.
	
	context.translate(vpCtrX-player.x,vpCtrY-player.y); //Move to point on map where player stands

	//TODO: Refactor: consider drawing palyer onto the map then just move the map..	This is how other things will be drawn. 
	context.drawImage(theMap, 0, 0);
	//Draw expected point of player UL.
	//context.fillStyle = 'rgb(255, 255, 51)' ;
	//context.fillRect(player.x, player.y, 2, 2) ;
	if(showGrid) {
		paintGrid(context, theMap.width, theMap.height);
	}
	context.restore(); //pop the canvas back to where it was which moves the map.
	console.log(player.toString());
	context.drawImage(player.spriteImg, vpX, vpY); //Draws player sprite in the middle of VP
	 //Draws player sprite in the middle of VP
	
}

function paintGrid(context, mapWidth, mapHeight) {
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	
	context.lineWidth = "0.5";
	gridWidth = ~~(mapWidth/tileWidth);
	gridHeight = ~~(mapHeight/tileHeight);
	
	//drawFrame
	context.strokeRect(0,0,mapWidth,mapHeight);
	
	context.lineWidth = "0.25";
	//drawVert
	for(x = 0; x<= gridWidth; x++) {
		xPos = tileWidth*x;
		drawLine(context,xPos,0,xPos,mapHeight);
		context.fillRect(xPos,2, 2, 2) ;
	}
	
	//drawHorz
	for(y = 0; y<= gridWidth; y++) {
		yPos = tileHeight*y;
		drawLine(context,0,yPos,mapWidth,yPos);
		context.fillRect(xPos,2, 2, 2) ;
	}
}

/**
 * Line Drawing Helper
 */
function drawLine(contextO, startx, starty, endx, endy) {
  contextO.beginPath();
  contextO.moveTo(startx, starty);
  contextO.lineTo(endx, endy);
  contextO.closePath();
  contextO.stroke();
}

/**
 * Simple player stub begging for more definition.
 */
function Player(pname, spriteImg) {
	this.name = pname;
	this.x = 0;
	this.y = 0;
	this.spriteImg = spriteImg;
	this.width = 32;
	this.height = 32;
	//spriteManager =  
	
}

Player.prototype.toString =  function() {
	out =  "[Player] name="+ this.name + " location="+ this.x + "," + this.y;
	return out;
}

function Mover(){
	
}

/**
 * xDir, yDir pos or neg value to move.
 */
Mover.prototype.movePlayer = function(player, xDir, yDir) {
	//use player location to get row,col of surrounding tiles.
	playerOldX = player.x;
	playerOldY = player.y;
	player.x += xDir;
	player.y += yDir;
	
	if(this.offMap(player, tiledMap)) {
		player.x = playerOldX;
		player.y = playerOldY;
		return;
	}
	
	mapCol = ~~(player.x/tileWidth)
	mapRow = ~~(player.y/tileHeight)
	//get 8 surrounding tiles and check for collision.
	surroundingTile = tiledMap.getRange(mapRow,mapCol, 3,3);
	//Look for collision if so see if blocked.
	for(t in surroundingTile){
		tile = surroundingTile[t];
		colls = this.checkCollision(player, tile);
		if(colls) {
			//TODO: add logic for checking variables involved in diff tile types. doing simple 0|1 for now.
			//if collision, see if blocked.
			if(!tile.hasOwnProperty('type') || tile.type == 0) {
				//blocked
				player.x = playerOldX;
				player.y = playerOldY;
				break;
			}
		}
	}
	
}

/**
 * clamp object to map so it cant ever get outside the map bounds.
 * @return true if if  
 */
Mover.prototype.offMap = function(entity, tiledMap){
	return (entity.x <0 || entity.y <0 || entity.x > tiledMap.width || entity.y > tiledMap.height);
}

Mover.prototype.checkCollision = function(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
