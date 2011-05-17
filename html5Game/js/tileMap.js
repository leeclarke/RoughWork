//The goal here is to work out tile map rendering for eventual API.
window.onload = windowReady;



function windowReady() {
	//console.log("Start painting");
	var CANVAS_WIDTH = 600;
	var CANVAS_HEIGHT = 400;

	//Create canvas
	var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
	var context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	
	context.fillStyle = 'rgb(0, 0, 0)' ;
	// Create fill gradient
	//var gradient = context.createLinearGradient(0,0,0,CANVAS_HEIGHT);
	//gradient.addColorStop(0, '#000');
	//gradient.addColorStop(1, '#fff');

	//context.fillStyle = gradient;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	
	
	//Display a tile from tile map
	//Test SpriteTileManager   Draw a couple of tiles side by side on the canvas.
	tileMap = new SpriteTileManager(32,32,"res/dungeontiles.gif");
	orgPt = tileMap.tileOrgPoint(4,2);
	orgPt2 = tileMap.tileOrgPoint(0,0);
	console.log("Returned x,y=" + orgPt.xPos + " y=" +orgPt.yPos);
	
	
	//Test retrival through use of namedTile.
	tileMap.addNamedTile('FLOOR1',0,0);
	orgPt3 = tileMap.namedTileOrgPoint('FLOOR1');
	console.log("xPos=="+orgPt3.xPos);
	
	doungeon = document.createElement('img');
	doungeon.onload = function () { 
		context.drawImage(doungeon, orgPt.xPos, orgPt.yPos, tileMap.tileWidth, tileMap.tileHeight, 100,100, tileMap.tileWidth, tileMap.tileHeight);
		context.drawImage(doungeon, orgPt2.xPos, orgPt2.yPos, tileMap.tileWidth, tileMap.tileHeight, 132,100, tileMap.tileWidth, tileMap.tileHeight);
		context.drawImage(doungeon, orgPt3.xPos, orgPt3.yPos, tileMap.tileWidth, tileMap.tileHeight, 100-32,100, tileMap.tileWidth, tileMap.tileHeight);
	}
	doungeon.src = 'res/dungeontiles.gif';
	
	
	
	
	//TODO:then an arraynamedTiles give ability to load maps from Arrays of data.
	
}

/**
 * Manages a Game Map, both data and rendered images.
 */
function TiledMap(width, height) {

	var map = document.createElement('canvas');
	map.width = width;
	map.height = height;
	mapCtx = map.getContext('2d');
	tiles = [];
	mapImage;
	tileManager = new SpriteTileManager();
	
	//this.setMapData(){
//		
//	}
	
	/**
	 * Returns a rendered Map Canvas ready for display on a game canvas. This is cached in a buffer 
	 * canvas to speed up rendering.  
	 */
	/*this.renderMap() {
		
		
		//draw at the 0,0 position 
		mapCtx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height, -25, -25, 50, 50); 
		// draw to game canvas like so source 
		//ctx.drawImage(mapCtx.canvas, x, y);
		return mapCtx.canvas;
	}*/
	
}

/**
 * Must track all data on each tile inorder to manage collision etc. 
 */
function Tile() {
	
}

/**
 * Manages Retriaval of sprites from a single img source.
 */
function SpriteTileManager(tileW, tileH, src) {
	this.tileWidth = (tileW)?tileW:0;
	this.tileHeight = (tileH)?tileH:0;
	this.imgSrc = (src)?src:"";
	this.namedTiles = {};
	
	/**
	 * Allows the definition of tiles in the image assigning them a constant name that can be requested 
	 * inplace of tile coordinants.
	 */
	this.addNamedTile = function(tileName, tileCol, tileRow) {
		this.namedTiles[tileName] = {"tileCol":tileCol, "tileRow":tileRow}
	}
	
	this.getNamedTile = function(tileName) {
		return this.namedTiles[tileName];
	}
	
	/**
	 * @return map containing x,y origin point for the requested tile.
	 */
	this.namedTileOrgPoint = function(tileName) {
		namedPt = this.getNamedTile(tileName);
		return this.tileOrgPoint(namedPt.tileCol,namedPt.tileRow);
	}
	
	/**
	 * @return map containing x,y origin point for the requested tile.
	 */
	this.tileOrgPoint = function(tileCol, tileRow) {
		var result = {"xPos": this.tileWidth*tileCol , "yPos": (this.tileHeight*tileRow)}
		return result;
	}
	
}
