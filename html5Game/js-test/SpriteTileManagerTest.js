SpriteTileManagerTest = TestCase("SpriteTileManagerTest");

//Setup test data.
var sprite_tileMapManager = new SpriteTileManager(null, 32,32,"../res/dungeontiles.gif");
var sprite_tile = {"id":0,"name":"FLOOR1","col":1,"row":2};
var sprite_tile2 = {"id":1,"name":"FLOOR2","col":0,"row":2};
var sprite_tile3 = {"id":3,"name":"DOOR2","col":1,"row":6};

sprite_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]}

SpriteTileManagerTest.prototype.testGetNamedTileById = function() {
	tileMapManagerObj = new SpriteTileManager(sprite_testManagerConfig);
			
	assertEquals(sprite_tile3,tileMapManagerObj.getNamedTileById(3));
}

SpriteTileManagerTest.prototype.testAddNamedTile_object = function() {
	sprite_tileMapManager.addNamedTile(sprite_tile);
	sprite_tileMapManager.addNamedTile(sprite_tile2);
	assertEquals(sprite_tile,sprite_tileMapManager.getNamedTileById(0));
}

SpriteTileManagerTest.prototype.testGetNamedTile = function() {
	sprite_tileMapManager.addNamedTile(sprite_tile);
	assertEquals(sprite_tile,sprite_tileMapManager.getNamedTile('FLOOR1'));
}

SpriteTileManagerTest.prototype.testGetNamedTileFail = function() {
	sprite_tileMapManager.addNamedTile(sprite_tile);
	assertNotSame(sprite_tile2,sprite_tileMapManager.getNamedTile('FLOOR1'));
}
