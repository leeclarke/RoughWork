/**
 * Here's where we build and manage the Map, also included in this fiel is the SpriteManager.
 */

/**
 * @object TiledMap
 * Manages a Game Map, both the data and rendered images.
 */
function TiledMap(width, height, tileWidth, tileHeight) {
	map = document.createElement('canvas');
	rows = 0;
	cols = 0;
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
 * Conveniance wrapper method
 */
TiledMap.prototype.getTileWidth = function() {
	return this.tileMapManager.tileWidth;
}

/**
 * Conveniance wrapper method
 */
TiledMap.prototype.getTileHeight = function() {
	return this.tileMapManager.tileHeight;
}

/**
 * Returns the size of the canvas containing the map. This size is adjusted to fit the tile size.
 TODO: Not being used and has an odd bug. Fix is needed.
 */
//TiledMap.prototype.getMapSize = function() {
//	return {"width":this.width, "height": this.height};
//}

/**
 * Safely grab a single tile from map.
 */
TiledMap.prototype.getTile = function(row, col) {
	if(row <0 || col <0 || row > this.rows || col > this.cols){
		return null;
	} else {
		if(col > this.tiles[row].length) {
			return null;
		} 
		return this.tiles[row][col];
	}
		
}

/**
 * Returns a rectangle of tile points around a given map tile, not exceeding the boundry of the map. 
 * 		Values exceeding will be set to the min/max
 * @return rectangle Object with upperLeft and bottomRight points or rectangle. 
 *		ex: {"upperLeft":{"row":0,"col":0},"bottomRight":{"row":0,"col":0}}
 */
TiledMap.prototype.getSurroundingTiles = function(startRow, startCol, radialHeight, radialWidth) {
	
	if(!radialHeight || radialHeight < 0) radialHeight = 0;
	if(!radialWidth  || radialWidth < 0) radialWidth = 0;
	
	leftTopPoint = {"row":(startRow-radialHeight),"col":(startCol-radialWidth)}
	rightBottomPoint = {"row":(startRow+radialHeight),"col":(startCol+radialWidth)}
	if(leftTopPoint.row <0) leftTopPoint.row = 0;
	if(leftTopPoint.col <0) leftTopPoint.col = 0;
	if(rightBottomPoint.row > this.rows) rightBottomPoint.row = this.rows;
	if(rightBottomPoint.col > this.cols) rightBottomPoint.col = this.cols;
	
	return 	{"upperLeft":leftTopPoint,"bottomRight":rightBottomPoint}
}


TiledMap.prototype.movementAttributes = { "unpassable":0,"open":1, "locked":2, "slow":3, "blocked":4, "trapped":5, "stairsUp":6, "stairsDown":7, "portal":8}

/**
 * Use to provide control over updating internals when the map layout data changes.
 * Use in place of setting tiles directly or the row/col values wont be set!
 * @param mapData  - data format is [[{"id":0,"type":0},{"id":0,"type":0}],[{"id":0,"type":0},{"id":0,"type":0}]]
 */
TiledMap.prototype.updateMap = function(mapData) {
	this.tiles = mapData;
	for(var rows = 0; rows < mapData.length ;rows++)
	{
		for(var cols = 0; cols < mapData[rows].length; cols++){
			tile = EntityManager.createEntity('MapTile')
			tile.init(mapData[rows][cols]);
			tile.col = cols;
			tile.row = rows;
			tile.x = (cols*this.tileMapManager.tileWidth); tile.y = (rows*this.tileMapManager.tileHeight); 
			tile.width = this.tileMapManager.tileWidth; tile.height = this.tileMapManager.tileHeight;
			this.tiles[rows][cols] = tile;	
		}		
	}
	
	this.rows = this.tiles.length;
	this.cols = this.getCols();
}

/**
 * Returns the max Cols for all rows.
 */
TiledMap.prototype.getCols = function() {
	colCnt = 0;
	for(x in this.tiles) {
		if(this.tiles[x].length> colCnt){
			colCnt = this.tiles[x].length;
		}
	}
	return colCnt;
}

/**
 * Returns a rendered Map Canvas ready for display on a game canvas. This is cached in a buffer 
 * canvas to speed up rendering.  
 */
TiledMap.prototype.renderMap = function() {	
	this.exploreTiles();
	for(var rows = 0; rows < this.tiles.length ;rows++)
	{
		for(var cols = 0; cols < this.tiles[rows].length; cols++){
			currTile = this.tiles[rows][cols];
			if(currTile.hasOwnProperty('id') && currTile.hasOwnProperty('type')) {
				sprPos = tileMapManager.namedTileOrgPoint(currTile.id);
				if(!sprPos) {
					if(currTile.id != -1) { //-1 is a blank
						console.log("Bad Tile named: "+ currTile.id);
					}
					continue;
				}
				if(GameEngine.lightsOn == false && currTile.explored == false){
					continue; //not visable yet, skip render
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
 * Make tiles in player range visable.
 {"upperLeft":{"row":0,"col":0},"bottomRight":{"row":0,"col":0}}
 */
TiledMap.prototype.exploreTiles = function() {	
	expArea = this.getSurroundingTiles(GameEngine.player.getRow(),GameEngine.player.getCol(),GameEngine.player.vision,GameEngine.player.vision);
	maxRow = (expArea.bottomRight.row>this.tiles.length)?this.tiles.length:expArea.bottomRight.row;
	for(var rows = expArea.upperLeft.row; rows < maxRow ;rows++) {
		bRight = (expArea.bottomRight.col>this.tiles[rows].length-1)?this.tiles[rows].length-1:expArea.bottomRight.col
		for(var cols = expArea.upperLeft.col; cols <= bRight; cols++){
			this.tiles[rows][cols].explored = true;	
		}
	}
}
