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
 */
TiledMap.prototype.getMapSize = function() {
	return {"width":this.map.width, "height": this.map.height};
}

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
 * Grab a rectangle of tiles and return tile array, width and height are inclusive of the starting tile.
 * //TODO: evaluate the need for this.. it is not being used by any objects currently.
 * Perhaps getRange should just return a rectangle of tile coordinates for use when working with tiles?
 */
TiledMap.prototype.getRange = function(startRow, startCol, tileHeight, tileWidth) {
	resp =[];
	//TODO: Doesnt work!
	//Should first determine the upper left point to start from , correcting for -1 nums by settign to 0.
	leftTopPoint = {"row":(startRow-tileHeight),"col":(startCol-tileWidth)}
	rightBottomPoint = {"row":(startRow+tileHeight),"col":(startCol+tileWidth)}
	if(leftTopPoint.row <0) leftTopPoint.row = 0;
	if(leftTopPoint.col <0) leftTopPoint.row = 0;
	if(tileHeight < 0) tileHeight = 0;
	if(tileWidth < 0) tileWidth = 0;
	
	//TODO: Make sure dont exceed sizes of rows or cols.	
	for(var rows = leftTopPoint.row; rows <= rightBottomPoint.row ;rows++)		{
		maxCol = (rightBottomPoint.col>this.tiles[rows].length)?this.tiles[rows].length:(rightBottomPoint.col) ;
		for(var cols = leftTopPoint.col; cols < maxCol; cols++) {
			
			aTile = this.tiles[rows][cols];
			//Shouldnt need below. verify its already correct.
			aTile.col = cols; aTile.row = rows;
			resp.push(aTile);
		}
	}
	//}*/
	return resp;
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
					//not visable yet, skip render
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
 * Make tiles in player range visable.
 */
TiledMap.prototype.exploreTiles = function() {	
	
	expArea = this.getSurroundingTiles(GameEngine.player.getRow(),GameEngine.player.getCol(),GameEngine.player.vision,GameEngine.player.vision);
	for(e = 0; e < expAv in viewRange) {
		tile = viewRange[v].explored = true;
	}
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
