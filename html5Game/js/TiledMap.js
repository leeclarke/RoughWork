//The goal here is to work out tile map rendering for eventual API.
//DONE: Built a Map loader! see TODOs below for finishing touches.
//TODO: make scrollable maps..and/or linking maps
window.onload = windowReady;

/**
 *  WindowReady used for testing functionality of the TiledMap object. 
 * Probably should move it to its own file at some point.
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
	
	//TODO:then an arraynamedTiles give ability to load maps from Arrays of data.
	tileWidth = 32;
	tileHeight = 32;
	var tiledMap = new TiledMap(CANVAS_WIDTH,CANVAS_HEIGHT,tileWidth,tileHeight);
	
//TODO: make the setable with and array of objects {"name":"","col":0,"row":0}
	tileMapManager = new SpriteTileManager(tileWidth,tileHeight,"res/dungeontiles.gif")
	tileMapManager.addNamedTile('WALL1',0,0); 
	tileMapManager.addNamedTile('FLOOR1',1,8);
	tileMapManager.addNamedTile('DOOR1',4,2);
	tileMapManager.addNamedTile('DOOR2',1,6);
//TODO: make object, loader or something to make this less nasty.	
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
	context.drawImage(mapCtx.canvas, 0, 0);
}


/**
 * @object TiledMap
 * Manages a Game Map, both the data and rendered images.
 * Note the Map width/height will be set to a whole number that is <= to the canvas (w/h) / tile (w/h) 
 */
function TiledMap(width, height, tileWidth, tileHeight) {
	var map = document.createElement('canvas');
	map.width = (~~(width/tileWidth))*tileWidth; //faster then calling floor
	map.height = (~~(height/tileHeight))*tileHeight;
	mapCtx = map.getContext('2d');
	tiles = [];
	BLANK_TILE = '';
	tileMapManager = "";	
	
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
				sprPos = tileMapManager.namedTileOrgPoint(tileType);
				tileX = cols*tileMapManager.tileWidth;
				tileY = rows*tileMapManager.tileHeight;
				mapCtx.drawImage(tileMapManager.spriteImage, sprPos.xPos, sprPos.yPos, tileMapManager.tileWidth, tileMapManager.tileHeight, tileX,tileY, tileMapManager.tileWidth, tileMapManager.tileHeight);
			}
		}
	
	}
	return mapCtx.canvas;
}

TiledMap.prototype.setMapData = function(){
		
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
function SpriteTileManager(tileW, tileH, src) {
	this.tileWidth = (tileW)?tileW:0;
	this.tileHeight = (tileH)?tileH:0;
	this.namedTiles = {};
	this.spriteImage = document.createElement('img');
	this.spriteImage.src = (src)?src:"";	
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
	namedPt = this.getNamedTile(tileName);
	return this.tileOrgPoint(namedPt.tileCol,namedPt.tileRow);
}

/**
 * Allows the definition of tiles in the image assigning them a constant name that can be requested 
 * inplace of tile coordinants.
 */
SpriteTileManager.prototype.addNamedTile = function(tileName, tileCol, tileRow) {
	this.namedTiles[tileName] = {"tileCol":tileCol, "tileRow":tileRow}
}

/**
 * Retrieve a Tile reference by its name.
 */
SpriteTileManager.prototype.getNamedTile = function(tileName) {
	return this.namedTiles[tileName];
}
/********** SpriteTileManager END **********/
