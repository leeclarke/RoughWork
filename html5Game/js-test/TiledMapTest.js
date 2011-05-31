TiledMapTest = TestCase("TiledMapTest");
var tile_tiledMap = new TiledMap(300,400,32,32);

tile_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"../res/dungeontiles.gif", "namedTiles":[
	{"id":0,"name":"WALL1","col":0,"row":0},
	{"id":1,"name":"FLOOR1","col":1,"row":8},
	{"id":2,"name":"DOOR1","col":4,"row":2},
	{"id":3,"name":"DOOR2","col":1,"row":6}
]}

tile_tileMapManager = new SpriteTileManager(tile_testManagerConfig);

tile_Maptiles = [
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

tile_tiledMap.tileMapManager = tile_tileMapManager;

/**
 * Added map data load function and new row/cols values for use by aStar. 
 */
TiledMapTest.prototype.testUpdateMap = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	assertTrue(tile_tiledMap.tiles.length > 1);
	assertTrue('TiledMap obj should have rows properties',	tile_tiledMap.hasOwnProperty('rows'));
	assertTrue('TiledMap obj should have cols properties',tile_tiledMap.hasOwnProperty('cols'));
	
	jstestdriver.console.log("TiledMapTest", tile_tiledMap.rows + "," + tile_tiledMap.cols);	
	assertEquals(11,tile_tiledMap.rows);
	assertEquals(16,tile_tiledMap.cols);
}

TiledMapTest.prototype.testMoveAtt = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	assertEquals(1,tile_tiledMap.movementAttributes["open"]);
}

//TODO: Add map edge tests at top and bottom rt.

TiledMapTest.prototype.testSurroundingTiles = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	startCol = 5;
	startRow = 4;
	rangeCol = 3;
	rangeRow = 3;
	tileArea = tile_tiledMap.getSurroundingTiles(startRow, startCol, rangeRow, rangeCol);
	
	assertNotNull(tileArea);
	assertTrue('getSurroundingTiles result obj should have upperLeft property',	  tileArea.hasOwnProperty('upperLeft'));
	assertTrue('getSurroundingTiles result obj should have bottomRight property', tileArea.hasOwnProperty('bottomRight'));
	assertTrue('getSurroundingTiles result obj.upperLeft should have col/row properties',	  tileArea.upperLeft.hasOwnProperty('col') && tileArea.upperLeft.hasOwnProperty('row'));
	assertTrue('getSurroundingTiles result obj.bottomRight should have col/row properties',	  tileArea.bottomRight.hasOwnProperty('col') && tileArea.bottomRight.hasOwnProperty('row'));
	
	//got whats expected now test values.
	assertEquals(2,tileArea.upperLeft.col);
	assertEquals(1,tileArea.upperLeft.row);
	assertEquals(8,tileArea.bottomRight.col);
	assertEquals(7,tileArea.bottomRight.row);
}

TiledMapTest.prototype.testSurroundingTiles_NearTop = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	startCol = 1;
	startRow = 1;
	rangeCol = 3;
	rangeRow = 3;
	tileArea = tile_tiledMap.getSurroundingTiles(startRow, startCol, rangeRow, rangeCol);
	
	assertNotNull(tileArea);
	assertTrue('getSurroundingTiles result obj should have upperLeft property',	  tileArea.hasOwnProperty('upperLeft'));
	assertTrue('getSurroundingTiles result obj should have bottomRight property', tileArea.hasOwnProperty('bottomRight'));
	assertTrue('getSurroundingTiles result obj.upperLeft should have col/row properties',	  tileArea.upperLeft.hasOwnProperty('col') && tileArea.upperLeft.hasOwnProperty('row'));
	assertTrue('getSurroundingTiles result obj.bottomRight should have col/row properties',	  tileArea.bottomRight.hasOwnProperty('col') && tileArea.bottomRight.hasOwnProperty('row'));
	
	//got whats expected now test values.
	assertEquals(0,tileArea.upperLeft.col);
	assertEquals(0,tileArea.upperLeft.row);
	assertEquals(4,tileArea.bottomRight.col);
	assertEquals(4,tileArea.bottomRight.row);
}

/**
 * Place the point right next to edge of map and ensure the area is narrowed appropratly
 */
TiledMapTest.prototype.testSurroundingTiles_NearBottomRight = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	startCol = tile_tiledMap.cols-1;
	startRow = tile_tiledMap.rows-1;
	rangeCol = 3;
	rangeRow = 3;
	tileArea = tile_tiledMap.getSurroundingTiles(startRow, startCol, rangeRow, rangeCol);
	
	assertNotNull(tileArea);
	assertTrue('getSurroundingTiles result obj should have upperLeft property',	  tileArea.hasOwnProperty('upperLeft'));
	assertTrue('getSurroundingTiles result obj should have bottomRight property', tileArea.hasOwnProperty('bottomRight'));
	assertTrue('getSurroundingTiles result obj.upperLeft should have col/row properties',	  tileArea.upperLeft.hasOwnProperty('col') && tileArea.upperLeft.hasOwnProperty('row'));
	assertTrue('getSurroundingTiles result obj.bottomRight should have col/row properties',	  tileArea.bottomRight.hasOwnProperty('col') && tileArea.bottomRight.hasOwnProperty('row'));
	
	//got whats expected now test values.
	assertEquals(startCol-rangeCol,tileArea.upperLeft.col);
	assertEquals(startRow-rangeRow,tileArea.upperLeft.row);
	assertEquals(tile_tiledMap.cols,tileArea.bottomRight.col);
	assertEquals(tile_tiledMap.rows,tileArea.bottomRight.row);
}

//TODO: There is a bug in the range, maybe or is it how its called?
TiledMapTest.prototype.testGetRange = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	startX = 5;
	startY = 4;
	rangeX = 3;
	rangeY = 3;
	/*range = tile_tiledMap.getRange(startX, startY, rangeX, rangeY);
	range.sort(function(a,b) {
		yVal = a.y - b.y;
		if(yVal == 0) {
			return a.x - b.x;
		} else {
			return yVal;
		}
	});
		*/
//	for(y = 0; range.length; y++) {
	//	tile = range[y];
		
//		for(x = 0; range[y].length; x++) {
			
	//	}
	//}
	
	
}


TiledMapTest.prototype.testGetRange_offMap = function() {	
	//tile_tiledMap.updateMap(tile_Maptiles);
	//assertEquals(1,tile_tiledMap.movementAttributes["open"]);
	
}


TiledMapTest.prototype.testGetTile = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	tTile = tile_tiledMap.getTile(2,1);
	assertNotNull(tTile);
	assertTrue('Tileobj should have id property',	tTile.hasOwnProperty('id'));
	assertEquals(2,tTile.id);
	assertEquals(2,tTile.type);
	assertTrue('MapTile should have property "y".',tTile.hasOwnProperty('y'));
	assertTrue('tTile should have property "x".',tTile.hasOwnProperty('x'));
	assertTrue('tTile should have property "col".',tTile.hasOwnProperty('col'));
	assertTrue('tTile should have property "row".',tTile.hasOwnProperty('row'));
	assertTrue('tTile should have property "width".',tTile.hasOwnProperty('width'));
	assertTrue('tTile should have property "height".',tTile.hasOwnProperty('height'));
	assertTrue('tTile should have property "explored".',tTile.hasOwnProperty('explored'));
	assertEquals(32,tTile.width);
}

TiledMapTest.prototype.testGetTileHeightWidth = function() {	
	assertEquals(32,tile_tiledMap.getTileWidth());
	assertEquals(32,tile_tiledMap.getTileHeight());
}

//TODO: Build better tests/ add getRange, getTile
TiledMapTest.prototype.testRenderMap = function() {
	//map = tiledMap.renderMap();
	//assertNotNull(map);
}

