/**
 * Here's where we build and manage the Map, also included in this fiel is the SpriteManager.
 */

/**
 * @object TiledMap
 * Manages a Game Map, both the data and rendered images.
 * Note the Map width/height will be set to a whole number that is <= to the canvas (w/h) / tile (w/h) 
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
 * Returns the size of the canvas containing the map. This size is adjusted to fit the tile size.
 */
TiledMap.prototype.getMapSize = function() {
	return {"width":this.width, "height": this.height};
}

/**
 * Safely grab a single tile from map.
 */
TiledMap.prototype.getTile = function(startRow, startCol) {
	rng = this.getRange(startRow, startCol,1,1);
	if(rng.length >0)
		return rng[0];
	else
		return null;	
}

/**
 * Grab a rectangle of tiles and return tile array, width and height are inclusive of the starting tile.
 */
TiledMap.prototype.getRange = function(startRow, startCol, tileWidth, tileHeight) {
	resp =[];
	
	if(startRow > -1 && startCol >-1 && tileWidth > -1 && tileHeight > -1){
		maxRow = ((startRow+tileHeight)>this.tiles.length)?this.tiles.length:(startRow+tileHeight);
		
		for(var rows = startRow; rows < maxRow ;rows++)		{
			maxCol = ((startCol+tileWidth)>this.tiles[rows].length)?this.tiles[rows].length:(startCol+tileWidth) ;
			for(var cols = startCol; cols < maxCol; cols++) {
				aTile = this.tiles[rows][cols];
				aTile.x = (cols*this.tileMapManager.tileWidth); aTile.y = (rows*this.tileMapManager.tileHeight); aTile.width = this.tileMapManager.tileWidth; aTile.height = this.tileMapManager.tileHeight;
				aTile.col = cols; aTile.row = rows;
				resp.push(aTile);
			}
		}
	}
	return resp;
}

TiledMap.prototype.movementAttributes = { "unpassable":0,"open":1, "locked":2, "slow":3, "blocked":4, "trapped":5, "stairsUp":6, "stairsDown":7, "portal":8}

/**
 * Use to provide control over updating internals when the map layout data changes.
 * Use in place of setting tiles directly or the row/col values wont be set!
 * @param mapData  - data format is [[{"id":0,"type":0},{"id":0,"type":0}],[{"id":0,"type":0},{"id":0,"type":0}]]
 */
TiledMap.prototype.updateMap = function(mapData) {
	this.tiles = mapData;
	this.rows = this.tiles.length;
	this.cols = this.getCols();
}

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
	for(var rows = 0; rows < this.tiles.length ;rows++)
	{
		for(var cols = 0; cols < this.tiles[rows].length; cols++){
			tileType = this.tiles[rows][cols];
			if(tileType.hasOwnProperty('id') && tileType.hasOwnProperty('type')) {
				sprPos = tileMapManager.namedTileOrgPoint(tileType.id);
				if(!sprPos) {
					console.log("Bad Tile named: "+ tileType.id);
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
	if(typeof tileName == 'string')
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
