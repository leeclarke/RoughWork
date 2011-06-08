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

SpriteTileManagerTest.prototype.testGetSequenceSpriteByDirection = function() {
	var player_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"../res/hero2.png", "namedTiles":[
		{"id":0,"name":"FRONT","col":0,"row":0},
		{"id":1,"name":"FRONT_RT","col":1,"row":0},
		{"id":2,"name":"FRONT_LT","col":2,"row":0},
		{"id":3,"name":"FRONT_SW","col":3,"row":0},
		{"id":4,"name":"LEFT_1","col":0,"row":1},
		{"id":5,"name":"LEFT_2","col":1,"row":1},
		{"id":6,"name":"LEFT_3","col":2,"row":1},
		{"id":7,"name":"LEFT_4","col":3,"row":1},
		{"id":8,"name":"RIGHT_1","col":0,"row":2},
		{"id":9,"name":"RIGHT_2","col":1,"row":2},
		{"id":10,"name":"RIGHT_3","col":2,"row":2},
		{"id":11,"name":"RIGHT_4","col":3,"row":2},
		{"id":12,"name":"BACK_1","col":0,"row":3},
		{"id":13,"name":"BACK_2","col":1,"row":3},
		{"id":14,"name":"BACK_3","col":2,"row":3},
		{"id":15,"name":"BACK_4","col":3,"row":3},
	]};
	var attackAnimation = [{"name":"attack_left",
		"sequence":[6,5,4,5,6,7,6,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.LEFT},
		{"name":"attack_right",
		"sequence":[10,9,8,9,10,11,10,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.RIGHT},
		{"name":"attack_up",
		"sequence":[13,12,13,14,13,15,13,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.UP},
		{"name":"attack_down",
		"sequence":[0,3,0,2,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.DOWN}
		];
		
	GameEngine.player = EntityManager.createEntity('Player');
	
	GameEngine.player.initSpriteManager(player_testManagerConfig,attackAnimation);
	
	var result = GameEngine.player.spriteManager.getSequenceSpriteByDirection(Mover.MoveDir.DOWN);
	assertNotNull(result);
	assertEquals('Expected Direction DOWN',Mover.MoveDir.DOWN, result.direction);
	
}

SpriteTileManagerTest.prototype.testInitAnimationSeqs = function() {
	var player_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"../res/hero2.png", "namedTiles":[
		{"id":0,"name":"FRONT","col":0,"row":0},
		{"id":1,"name":"FRONT_RT","col":1,"row":0},
		{"id":2,"name":"FRONT_LT","col":2,"row":0},
		{"id":3,"name":"FRONT_SW","col":3,"row":0},
		{"id":4,"name":"LEFT_1","col":0,"row":1},
		{"id":5,"name":"LEFT_2","col":1,"row":1},
		{"id":6,"name":"LEFT_3","col":2,"row":1},
		{"id":7,"name":"LEFT_4","col":3,"row":1},
		{"id":8,"name":"RIGHT_1","col":0,"row":2},
		{"id":9,"name":"RIGHT_2","col":1,"row":2},
		{"id":10,"name":"RIGHT_3","col":2,"row":2},
		{"id":11,"name":"RIGHT_4","col":3,"row":2},
		{"id":12,"name":"BACK_1","col":0,"row":3},
		{"id":13,"name":"BACK_2","col":1,"row":3},
		{"id":14,"name":"BACK_3","col":2,"row":3},
		{"id":15,"name":"BACK_4","col":3,"row":3},
	]};
	var attackAnimation = [{"name":"attack_left",
		"sequence":[6,5,4,5,6,7,6,0], 
		"sequenceFrameDuration":2},
		{"name":"attack_right",
		"sequence":[10,9,8,9,10,11,10,0], 
		"sequenceFrameDuration":2}
		];
	
	var sprite_tileMapManager = new SpriteTileManager(player_testManagerConfig);
	
	sprite_tileMapManager.initAnimationSeqs(attackAnimation);
	
}


SpriteTileManagerTest.prototype.testInitAnimationSeqs_invalidSequence = function() {
	var player_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"../res/hero2.png", "namedTiles":[
		{"id":0,"name":"FRONT","col":0,"row":0},
		{"id":1,"name":"FRONT_RT","col":1,"row":0},
		{"id":2,"name":"FRONT_LT","col":2,"row":0},
		{"id":3,"name":"FRONT_SW","col":3,"row":0},
		{"id":4,"name":"LEFT_1","col":0,"row":1},
		{"id":5,"name":"LEFT_2","col":1,"row":1},
		{"id":6,"name":"LEFT_3","col":2,"row":1},
		{"id":7,"name":"LEFT_4","col":3,"row":1},
		{"id":8,"name":"RIGHT_1","col":0,"row":2},
		{"id":9,"name":"RIGHT_2","col":1,"row":2},
		{"id":10,"name":"RIGHT_3","col":2,"row":2},
		{"id":11,"name":"RIGHT_4","col":3,"row":2},
		{"id":12,"name":"BACK_1","col":0,"row":3},
		{"id":13,"name":"BACK_2","col":1,"row":3},
		{"id":14,"name":"BACK_3","col":2,"row":3},
		{"id":15,"name":"BACK_4","col":3,"row":3},
		{"id":16,"name":"DEAD","col":0,"row":4},
	]};
	var attackAnimation = [{"name":"attack_left",
		"sequence":[6,5,4,15,6,27,6,0], 
		"sequenceFrameDuration":2},
		{"name":"attack_right",
		"sequence":[10,9,8,9,10,11,10,0], 
		"sequenceFrameDuration":2}
		];
	
	var sprite_tileMapManager = new SpriteTileManager(player_testManagerConfig);
	try {
		sprite_tileMapManager.initAnimationSeqs(attackAnimation);
	} catch(err) {
		jstestdriver.console.log("SpriteTileManagerTest", "initAnimationSeqs return Error as expected. Err="+err);	
	}
	
}

SpriteTileManagerTest.prototype.testAnimationSequences = function() {
	//TODO: Finish writing Test
	var player_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"../res/hero2.png", "namedTiles":[
		{"id":0,"name":"FRONT","col":0,"row":0},
		{"id":1,"name":"FRONT_RT","col":1,"row":0},
		{"id":2,"name":"FRONT_LT","col":2,"row":0},
		{"id":3,"name":"FRONT_SW","col":3,"row":0},
		{"id":4,"name":"LEFT_1","col":0,"row":1},
		{"id":5,"name":"LEFT_2","col":1,"row":1},
		{"id":6,"name":"LEFT_3","col":2,"row":1},
		{"id":7,"name":"LEFT_4","col":3,"row":1},
		{"id":8,"name":"RIGHT_1","col":0,"row":2},
		{"id":9,"name":"RIGHT_2","col":1,"row":2},
		{"id":10,"name":"RIGHT_3","col":2,"row":2},
		{"id":11,"name":"RIGHT_4","col":3,"row":2},
		{"id":12,"name":"BACK_1","col":0,"row":3},
		{"id":13,"name":"BACK_2","col":1,"row":3},
		{"id":14,"name":"BACK_3","col":2,"row":3},
		{"id":15,"name":"BACK_4","col":3,"row":3},
	]};
	var attackAnimation = [{"name":"attack_left",
		"sequence":[6,5,4,5,6,7,6,0], 
		"sequenceFrameDuration":4},
		{"name":"attack_right",
		"sequence":[10,9,8,9,10,11,10,0], 
		"sequenceFrameDuration":4}
		];
		
	var player = EntityManager.createEntity('Player');
	
	player.initSpriteManager(player_testManagerConfig,attackAnimation);
	
	player.currentSequence = 'attack_left';
	//Calling function results in TypeError??  not sure whats up.
	var playerImg = player.renderImg();
	
	assertNotNull(playerImg);
	assertEquals("IMG",playerImg.tagName);
}
