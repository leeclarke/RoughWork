//The goal here is to work out tile map rendering for eventual API.
window.onload = windowReady;

function windowReady() {
	//console.log("Start painting");
	var CANVAS_WIDTH = 480;
	var CANVAS_HEIGHT = 320;

	//Create canvas
	var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
	var context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	
	//context.fillStyle = 'rgb(185, 0, 0)' ;
	// Create fill gradient
	var gradient = context.createLinearGradient(0,0,0,CANVAS_HEIGHT);
	gradient.addColorStop(0, '#000');
	gradient.addColorStop(1, '#fff');
	
	context.fillStyle = gradient;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	
	
	//Display a tile from tile map
	//Test TileMap   Draw a couple of tiles side by side on the canvas.
	tileMap = new TileMap(32,32,"res/dungeontiles.gif");
	orgPt = tileMap.tileOrgPoint(4,2);
	orgPt2 = tileMap.tileOrgPoint(0,0);
	console.log("Returned x,y=" + orgPt.xPos + " y=" +orgPt.yPos);
	
	doungeon = document.createElement('img');
	doungeon.onload = function () { 
		context.drawImage(doungeon, orgPt.xPos, orgPt.yPos, tileMap.tileWidth, tileMap.tileHeight, 100,100, tileMap.tileWidth, tileMap.tileHeight);
		context.drawImage(doungeon, orgPt2.xPos, orgPt2.yPos, tileMap.tileWidth, tileMap.tileHeight, 132,100, tileMap.tileWidth, tileMap.tileHeight);
	}
	doungeon.src = 'res/dungeontiles.gif';
	
	//Test retrival through use of namedTile.
	
	
	//TODO:then an array give ability to load maps from Arrays of data.
	
}

/**
 * Manages Retriaval of sprites from a single img source.
 */
function TileMap(tileW, tileH, src) {
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
		tile = this.namedTiles[tileName];
		return this.tileOrgPoint(tile.tileCol, tile.tileRow);
	}
	
	/**
	 * @return map containing x,y origin point for the requested tile.
	 */
	this.tileOrgPoint = function(tileCol, tileRow) {
		xPos = this.tileWidth*tileCol;
		var result = {"xPos": xPos , "yPos": (this.tileHeight*tileRow)}
		return result;
	}
}
