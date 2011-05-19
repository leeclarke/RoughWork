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

TiledMapTest.prototype.testUpdateMap = function() {	
	tile_tiledMap.updateMap(tile_Maptiles);
	assertTrue(tile_tiledMap.tiles.length > 1);
	assertTrue('TiledMap obj should have rows properties',	creature.hasOwnProperty('rows'));
	assertTrue('TiledMap obj should have cols properties',creature.hasOwnProperty('cols'));
	
	jstestdriver.console.log("TiledMapTest", "wtf?");	
}

//TODO: Build better tests
TiledMapTest.prototype.testRenderMap = function() {
	//map = tiledMap.renderMap();
	//assertNotNull(map);
}

