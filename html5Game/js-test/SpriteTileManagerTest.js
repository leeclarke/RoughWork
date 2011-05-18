SpriteTileManagerTest = TestCase("SpriteTileManagerTest");

//Setup test data.
var tileMapManager = new SpriteTileManager(null, 32,32,"../res/dungeontiles.gif");
var tile = {"id":0,"name":"FLOOR1","col":1,"row":2};
var tile2 = {"id":1,"name":"FLOOR2","col":0,"row":2};
var tile3 = {"id":3,"name":"DOOR2","col":1,"row":6};

sprite_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]}

SpriteTileManagerTest.prototype.testGetNamedTileById = function() {
	tileMapManagerObj = new SpriteTileManager(sprite_testManagerConfig);
			
	assertEquals(tile3,tileMapManagerObj.getNamedTileById(3));
}

SpriteTileManagerTest.prototype.testAddNamedTile_object = function() {
	tileMapManager.addNamedTile(tile);
	tileMapManager.addNamedTile(tile2);
	assertEquals(tile,tileMapManager.getNamedTileById(0));
}

SpriteTileManagerTest.prototype.testGetNamedTile = function() {
	tileMapManager.addNamedTile(tile);
	assertEquals(tile,tileMapManager.getNamedTile('FLOOR1'));
}

SpriteTileManagerTest.prototype.testGetNamedTileFail = function() {
	tileMapManager.addNamedTile(tile);
	assertNotSame(tile2,tileMapManager.getNamedTile('FLOOR1'));
}
