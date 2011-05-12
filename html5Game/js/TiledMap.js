//The goal here is to work out tile map rendering for eventual API.

//TODO: develop the map collision. see line 14ish
//DONE: * make named tile definition indicate blocking. blocking = 1.
//TODO: -> have tiledMap recognize blocking and update code for improved data object
//TODO: - build collision arrays.(Moving in pixels really reaquires mappign by px not tiles.)
//TODO: - Implement collision Map interface 
//TODO: - Implement Mover Stub.
//TODO: finish grid
//TODO: look into new requestAnimationFrame() function which makes animation safer and accurate.
//TODO: SoundManager is best at the moment for sounds but audioApi is better once avail. check into IO session.
//TODO: convert data input for map layout into ints (IDs)
//TODO: DESIGN: When building a level editor it might be more efficent for it to save the level map as an image if the level isnt 
//      dynamicly built.Would it work for the maps to be built on the back end by Node.js if they are generated?

//TODO: collision detection. 
// 1. Tile bounding boxes, checking oavelap.
// 2. Using a mask and checking for blue color which would indicate blocking
//		var myImageData = context.getImageData(left, top, width, height);
//		ex.  blueComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 2];
// 3. Create my own int[width][height] array with 0 for open and 1 for blocking pixel.
// 4. look at other JS games for other ideas.

//window.onload = windowReady;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;
var showGrid = true;
var player;
var theMap;
var context;

/**
 *  WindowReady used for testing functionality of the TiledMap object. 
 * Probably should move it to its own file at some point.
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

//TODO: define constants or something Strings to messy and long. not good for storage, ints better.
//TODO: need to move to new format [{"id":"WALL1", "moveAttr":1}]
	tiledMap.tiles = [['WALL1',''],
				['','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1'],
				['','DOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1'],
				['','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','DOOR2','FLOOR1','FLOOR1','FLOOR1','FLOOR1','DOOR2','FLOOR1','FLOOR1','FLOOR1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1'],
				['','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','FLOOR1','FLOOR1','FLOOR1','DOOR2','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','DOOR1'],
				['','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1',],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1']
				
	];
	tiledMap.tileMapManager = tileMapManager;
	
	theMap = tiledMap.renderMap();
	//draw to canvas	
	
	//TODO: internalize this into the function, shouldnt be determined here. Could come from the spriteManager. 
	//      It will be needed for all game Entities for placement. SpriteManager is probably more apropreate location.
	// 		This would allow all Entities to render themselves if wanted to at least provide the info for a single render to do it.
	player = new Player("Test",playerImage);
	player.location.x = 128;
	player.location.y = 96;
	//renderViewPort(context, theMap, player, vpX,vpY);  
	
	render();
}

function render() {
	vpX = (CANVAS_WIDTH/2)-(tileWidth/2); //centers the player sprite, this will move the sprite off the tile perhaps.
	vpY = (CANVAS_HEIGHT/2)-(tileHeight/2);
	console.log("vpX ="+vpX +" vpY=" +vpY )
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	renderViewPort(context, theMap, player, vpX,vpY);  
}

//TODO: REMOVE this is for testing only.  add key_status.js to html page for actual support.
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
//TODO finsh up drawing grid
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	context.lineWidth = "1.0";
	drawLine(context,32,0,32,CANVAS_HEIGHT);
}

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

/**
 * @object TiledMap
 * Manages a Game Map, both the data and rendered images.
 * Note the Map width/height will be set to a whole number that is <= to the canvas (w/h) / tile (w/h) 
 */
function TiledMap(width, height, tileWidth, tileHeight) {
	map = document.createElement('canvas');
	height = (~~(height/tileHeight))*tileHeight;
	width = (~~(width/tileWidth))*tileWidth;
	map.width = (~~(width/tileWidth))*tileWidth; //faster then calling floor
	map.height = (~~(height/tileHeight))*tileHeight;
	mapCtx = map.getContext('2d');
	tiles = [];
	BLANK_TILE = '';
	tileMapManager = "";	
}

/**
 * Returns the size of the canvas containing the map. This size is adjusted to fit the tile size.
 */
TiledMap.prototype.getMapSize = function() {
	return {"width":this.width, "height": this.height};
}

/**
 * Returns a rendered Map Canvas ready for display on a game canvas. This is cached in a buffer 
 * canvas to speed up rendering.  
 */
TiledMap.prototype.renderMap = function() {
	
	for(var rows = 0; rows < this.tiles.length ;rows++)
	{
		for(var cols = 0; cols < this.tiles[rows].length; cols++){
			tileType = this.tiles[rows][cols];
			if(tileType != BLANK_TILE) {
				sprPos = tileMapManager.namedTileOrgPoint(tileType); //TODO: Test out id vs name retrival on tiles.
				if(!sprPos) {
					console.log("Bad Tile named: "+ tileType);
					continue;
				}
				tileX = cols*tileMapManager.tileWidth;
				tileY = rows*tileMapManager.tileHeight;
				mapCtx.drawImage(tileMapManager.spriteImage, sprPos.xPos, sprPos.yPos, tileMapManager.tileWidth, tileMapManager.tileHeight, tileX,tileY, tileMapManager.tileWidth, tileMapManager.tileHeight);
			}
		}
	}
	return mapCtx.canvas;
}

/**
 * Render a subset of the whole map based on the size of the view port and 
 * base the window on either the upper left corner or a centerpoint.
 * @param
 * @param
 * @param referencePoint - x,y positon of the center or
 */
TiledMap.prototype.renderMapSection = function(viewPortWidth, viewPortHeight, referencePoint) {
	//TODO: need to decide how to specify ref point, assume centering for now.
	//TODO:  Remove this?
}

TiledMap.prototype.setMapData = function(){
	//TODO: add
	console.log("setMapData not implemented.");	
}
/********** TiledMap END **********/

/**
 * @object  Tile
 * Must track all data on each tile inorder to manage collision etc. 
 */
function Tile() {
	movementAttributes = { 0:"unpassable",1:"open", 2:"locked", 3:"slow", 4:"blocked", 5:"trapped", 6:"stairsUp", 7:"stairsDown", 8:"portal"}
	//TODO: might not need this.
	this.blocking = false; //indicates if the tile is passable floors are not blocking and walls are true etc..
	this.type = "";
	
}
/********** Tile END **********/

/**
 * @object SpriteTileManager
 * Manages Retriaval of sprites from a single img source. 
 * 
 * TODO: RESEARCH: For performance reasons it might be best if one SpriteManager was created per game 
 *		 and all sprites were in one image file, would this be best for download? 
 */
function SpriteTileManager(config, tileW, tileH, src) {
	
	
	if(config){
		this.tileWidth = (config.tileWidth)?config.tileWidth:0;
		this.tileHeight = (config.tileHeight)?config.tileHeight:0;
		this.namedTiles = (config.namedTiles)?config.namedTiles:[];
		this.spriteImage = document.createElement('img');
		this.spriteImage.src = (config.src)?config.src:"";		
	} else{
		this.tileWidth = (tileW)?tileW:0;
		this.tileHeight = (tileH)?tileH:0;
		this.namedTiles = {};
		this.spriteImage = document.createElement('img');
		this.spriteImage.src = (src)?src:"";	
	}
}

/**  SpriteTileManagermethods **/
/**
 * @param  tileCol, tileRow - specific col,row coordinates.
 * @return map containing x,y origin point for the requested tile.
 */
SpriteTileManager.prototype.tileOrgPoint = function(tileCol, tileRow) {
	var result = {"xPos": this.tileWidth*tileCol , "yPos": (this.tileHeight*tileRow)}
	return result;
}
/**
 * @param tile Name given when added to namedTiles
 * @return map containing x,y origin point for the requested tile.
 */
SpriteTileManager.prototype.namedTileOrgPoint = function(tileName) {
	if(typeof 'String')
		namedPt = this.getNamedTile(tileName);
	else
		namedPt = this.getNamedTileById(tileName);
	if(namedPt) {
		return this.tileOrgPoint(namedPt.col,namedPt.row);
	} else {	
		return null;
	}
}

/**
 * Retrieve a Tile reference by its name.
 */
SpriteTileManager.prototype.getNamedTile = function(tileName) {
	for(tile in this.namedTiles) {
		if(this.namedTiles[tile].name == tileName) {
			return this.namedTiles[tile];
		}
	}
	return null;
}

/**
 *  Accepts an object with tileData in the following format  
 * {"id":0,"name":"","col":0,"row":0}
 */
SpriteTileManager.prototype.addNamedTile = function(tileData) {
	return this.namedTiles[tileData.id] = tileData;
}

/**
 * 
 */
SpriteTileManager.prototype.getNamedTileById = function(id) {
	return this.namedTiles[id];
}
/********** SpriteTileManager END **********/
