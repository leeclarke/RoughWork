SpriteTileManagerTest = TestCase("SpriteTileManagerTest");

//Setup test data.
tileMapManager = new SpriteTileManager(null, 32,32,"../res/dungeontiles.gif");
tile = {"id":0,"name":"FLOOR1","col":1,"row":2};
tile2 = {"id":1,"name":"FLOOR2","col":0,"row":2};
tile3 = {"id":3,"name":"DOOR2","col":1,"row":6};

testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"../res/dungeontiles.gif", "namedTiles":[
	{"id":0,"name":"WALL1","col":0,"row":0},
	{"id":1,"name":"FLOOR1","col":1,"row":8},
	{"id":2,"name":"DOOR1","col":4,"row":2},
	{"id":3,"name":"DOOR2","col":1,"row":6}
]}

EntityManagerTest.prototype.testGetNamedTileById = function() {
	tileMapManagerObj = new SpriteTileManager(testManagerConfig);
			
	assertEquals(tile3,tileMapManagerObj.getNamedTileById(3));

}

EntityManagerTest.prototype.testAddNamedTile_object = function() {
	tileMapManager.addNamedTile(tile);
	tileMapManager.addNamedTile(tile2);
	assertEquals(tile,tileMapManager.getNamedTileById(0));
}

EntityManagerTest.prototype.testGetNamedTile = function() {
	tileMapManager.addNamedTile(tile);
	assertEquals(tile,tileMapManager.getNamedTile('FLOOR1'));
}

EntityManagerTest.prototype.testGetNamedTileFail = function() {
	tileMapManager.addNamedTile(tile);
	assertNotSame(tile2,tileMapManager.getNamedTile('FLOOR1'));
}
