//The goal here is to work out tile map rendering for eventual API.
//DONE: Built a Map loader! see TODOs below for finishing touches.
//TODO: make scrollable maps..and/or linking maps
//TODO: need to be able to center scrollable map on a map point
//TODO: convert data input for map layout into ints (IDs)
//TODO: DESIGN: When building a level editor it might be more efficent for it to save the level map as an image if the level isnt 
//      dynamicly built.Would it work for the maps to be built on the back end by Node.js if they are generated?

//window.onload = windowReady;

/**
 *  WindowReady used for testing functionality of the TiledMap object. 
 * Probably should move it to its own file at some point.
 *
 * This simulates an actual game client
 */
function windowReady() {
	//console.log("Start painting");
	var CANVAS_WIDTH = 600;
	var CANVAS_HEIGHT = 400;

	//Create canvas
	var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
	var context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	//Set up background.
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	
	tileWidth = 32;
	tileHeight = 32;
	var tiledMap = new TiledMap(CANVAS_WIDTH,CANVAS_HEIGHT,tileWidth,tileHeight);

	testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]}
	
	tileMapManager = new SpriteTileManager(testManagerConfig);

//TODO: define constants or something Strings to messy and long. not good for storage, ints better.
	tiledMap.tiles = [['',''],
				['','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1'],
				['','DOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1'],
				['','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','DOOR2','FLOOR1','FLOOR1','FLOOR1','FLOOR1','DOOR2','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','','','','','','','','','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1']
				
	];
	tiledMap.tileMapManager = tileMapManager;
	
	theMap = tiledMap.renderMap();
	//draw to canvas
	//context.translate(-50,-50);
	//adjustViewPort(context,x,y);
	
	//add fake player
	playerImage = document.createElement('img');
	playerImage.src = "res/player.png";
	pX = 340;
	pY = 250;
	
	context.drawImage(theMap, 0, 0);
	context.drawImage(playerImage, pX, pY);
	//context.translate(-50,-50);
}

/**
 * Simple player stub begging for more definition.
 */
function Player(name, spriteImg) {
	this.name = name;
	//spriteManager =  
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
	this.blocking = false; //indicates if the tile is passable floors are not blocking and walls are true etc..
	this.type = "";
	
}
/********** Tile END **********/

/**
 * @object SpriteTileManager
 * Manages Retriaval of sprites from a single img source.
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
