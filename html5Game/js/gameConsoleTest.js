var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;
var showGrid = false;   //TODO: Fix Grid, its off by like 6 px os so.
var player;
var theMap;
var context;

/**
 * WindowReady used for starting up the game prototype.
 *
 * This simulates an actual game client
 */
function windowReady() {
	//console.log("Start painting");
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
				[{},{"id":2, "type":2},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
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
	player.location.x = 128;
	player.location.y = 96;
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
  if (keydown.left) {
    player.location.x -= 32; //TODO: implement a Mover that handles collision.
  }

  if (keydown.right) {
    player.location.x += 32;
  }
  
  if (keydown.up) {
      player.location.y -= 32;
  }
  
  if (keydown.down) {
        player.location.y += 32;
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
	
	context.translate(vpCtrX-player.location.x,vpCtrY-player.location.y); //Move to point on map where player stands

	//TODO: Refactor: consider drawing palyer onto the map then just move the map..	This is how other things will be drawn. 
	context.drawImage(theMap, 0, 0);
	//Draw expected point of player UL.
	context.fillStyle = 'rgb(255, 255, 51)' ;
	context.fillRect(player.location.x, player.location.y, 2, 2) ;
	context.restore(); //pop the canvas back to where it was which moves the map.
	console.log(player.toString());
	context.drawImage(player.spriteImg, vpX, vpY); //Draws player sprite in the middle of VP
	 //Draws player sprite in the middle of VP
	if(showGrid) {
		paintGrid(context);
	}
}

function paintGrid(context) {
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	context.fillStyle = 'rgb(255, 255, 51)' ;
	context.lineWidth = "0.25";
	gridWidth = ~~(CANVAS_WIDTH/tileWidth);
	gridHeight = ~~(CANVAS_HEIGHT/tileHeight);
	//drawVert
	for(x = 0; x<= gridWidth; x++) {
		xPos = tileWidth*x;
		drawLine(context,xPos,0,xPos,CANVAS_HEIGHT);
		context.fillRect(xPos,2, 2, 2) ;
	}
	
	//drawHorz
	for(y = 0; y<= gridWidth; y++) {
		yPos = tileHeight*y;
		drawLine(context,0,yPos,CANVAS_WIDTH,yPos);
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
	this.location = {"x":0, "y":0};
	this.spriteImg = spriteImg;
	//spriteManager =  
	
}

Player.prototype.toString =  function() {
	out =  "[Player] name="+ this.name + " location="+ this.location.x + "," + this.location.y;
	return out;
}
