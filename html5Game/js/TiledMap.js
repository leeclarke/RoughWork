//The goal here is to work out tile map rendering for eventual API.
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
	
	
	//Display a tile from tile map
	//Test SpriteTileManager   Draw a couple of tiles side by side on the canvas.
/*	tileMap = new SpriteTileManager(32,32,"res/dungeontiles.gif");
	orgPt = tileMap.tileOrgPoint(4,2);
	orgPt2 = tileMap.tileOrgPoint(0,0);
	console.log("Returned x,y=" + orgPt.xPos + " y=" +orgPt.yPos);
	
	
	//Test retrival through use of namedTile.
	tileMap.addNamedTile('FLOOR1',0,0);
	orgPt3 = tileMap.namedTileOrgPoint('FLOOR1');
	console.log("xPos=="+orgPt3.xPos);
	
	tileMap.spriteImage.onload = function () { 
		console.log("tileMap onLoad!");
		context.drawImage(tileMap.spriteImage, orgPt.xPos, orgPt.yPos, tileMap.tileWidth, tileMap.tileHeight, 100,100, tileMap.tileWidth, tileMap.tileHeight);
		context.drawImage(tileMap.spriteImage, orgPt2.xPos, orgPt2.yPos, tileMap.tileWidth, tileMap.tileHeight, 132,100, tileMap.tileWidth, tileMap.tileHeight);
		context.drawImage(tileMap.spriteImage, orgPt3.xPos, orgPt3.yPos, tileMap.tileWidth, tileMap.tileHeight, 100-32,100, tileMap.tileWidth, tileMap.tileHeight);
		context.drawImage(tileMap.spriteImage, orgPt3.xPos, orgPt3.yPos, tileMap.tileWidth, tileMap.tileHeight, 100-32-32,100, tileMap.tileWidth, tileMap.tileHeight);
	}*/
	//tileMap.spriteImage.src = "res/dungeontiles.gif";

	//TODO:then an arraynamedTiles give ability to load maps from Arrays of data.
	
	var tiledMap = new TiledMap(CANVAS_WIDTH,CANVAS_HEIGHT,32,32);
//TODO: make the setable with and array of objects {"name":"","col":0,"row":0}
	tiledMap.tileMapManager.addNamedTile('WALL1',0,0); 
	tiledMap.tileMapManager.addNamedTile('FLOOR1',0,8);
	tiledMap.tileMapManager.addNamedTile('DOOR1',4,2);
	tiledMap.tileMapManager.addNamedTile('DOOR2',1,6);
	tiledMap.tiles = [['',''],
				['','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1'],
				['','DOOR1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','WALL1'],
				['','WALL1','FLOOR1','FLOOR1','FLOOR1','FLOOR1','DOOR2'],
				['','WALL1','WALL1','WALL1','WALL1','WALL1','WALL1']
	];
	
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
	ready = false;
	tileMapManager = new SpriteTileManager(tileWidth,tileHeight,"res/dungeontiles.gif");	
	tileMapManager.spriteImage.onload = function() {
		this.ready = true;
	}
}

/**
 * Returns a rendered Map Canvas ready for display on a game canvas. This is cached in a buffer 
 * canvas to speed up rendering.  
 */
TiledMap.prototype.renderMap = function() {
	/**	sudo code + actual code, needs finishing
	//For each Map tile data drawTile.
	//Retrieve the tile image data
	orgPt = tileMap.namedTileOrgPoint('FLOOR1');
	//increment x,y tile position to next position, (these could be generated once at init).
	
	context.drawImage(tileMapManager.spriteImage, orgPt.xPos, orgPt.yPos, tileMapManager.tileWidth, tileMapManager.tileHeight, tileX,tileY, tileMapManager.tileWidth, tileMapManager.tileHeight);
	*/
	while(this.ready == false) {
		console.log('wait for load');
	}
	
	for(var col = 0; this.tiles.length ;col++)
	{
		for(var row = 0; this.tiles[col].length; row++){
			tileType = this.tiles[col][row];
			sprPos = tileMapManager.namedTileOrgPoint(tileType);
			tileX = col*tileMapManager.tileWidth;
			tileY = row*tileMapManager.tileHeight;
			mapCtx.drawImage(tileMapManager.spriteImage, sprPos.xPos, sprPos.yPos, tileMapManager.tileWidth, tileMapManager.tileHeight, tileX,tileY, tileMapManager.tileWidth, tileMapManager.tileHeight);
		}
	
	}
	//draw at the 0,0 position 
	//mapCtx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height, -25, -25, 50, 50); 
	// draw to game canvas like so source 
	//ctx.drawImage(mapCtx.canvas, x, y);
	return mapCtx.canvas;
}

TiledMap.prototype.setMapData = function(){
		
}
/** TiledMap END **/

/**
 * Must track all data on each tile inorder to manage collision etc. 
 */
function Tile() {
	this.blocking = false; //indicates if the tile is passable floors are not blocking and walls are true etc..
}

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
/** SpriteTileManager END **/
