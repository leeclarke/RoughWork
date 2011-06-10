MoverTest = TestCase("MoverTest");

//TODO: clean out this stuff.. cant really need all of it...
var tileWidth = 32;
var tileHeight = 32;
var moverTestMap = new TiledMap(CANVAS_WIDTH+300,CANVAS_HEIGHT+300,tileWidth,tileHeight);

var testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
	{"id":0,"name":"WALL1","col":0,"row":0},
	{"id":1,"name":"FLOOR1","col":1,"row":8},
	{"id":2,"name":"DOOR1","col":4,"row":2},
	{"id":3,"name":"DOOR2","col":1,"row":6}
]}

tileMapManager = new SpriteTileManager(testManagerConfig);

mover_Maptiles == [
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
		[{},{},{},{},{},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
		[{},{},{},{},{},{},{},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}]
];
		//TODO: fix this it should be set using the init method. 
moverTestMap.tileMapManager = tileMapManager;

moverTestMap.updateMap(mover_Maptiles);

//Dont intersect
rec1 = {"x":2,"y":3, "width":4, "height":4};
rec2 = {"x":3,"y":8, "width":4, "height":4};

//Intersect/collide with each other.
rec3 = {"x":3,"y":4, "width":4, "height":4};
rec4 = {"x":3,"y":4, "width":4, "height":4};
		
MoverTest.prototype.testCheckCollision_NoCollision = function() {
	mover = new Mover();
	assertFalse(mover.checkCollision(rec1,rec2));
}


MoverTest.prototype.testCheckCollision_Collision = function() {
	mover = new Mover();
	assertTrue(mover.checkCollision(rec3,rec4));
}

MoverTest.prototype.testMovePlayer = function() {
	player = EntityManager.createEntity('Player');
	player.x = 4*32;
	player.y = 2*32;
	mover = new Mover();
	resp_noCol = mover.movePlayer(player, 0,32);
}

/**
 * Testing out of range move, the monster locations should stay the same and isHostile = false.
 */
MoverTest.prototype.testMoveMonsterOutOfRange = function() {
	mover = new Mover();
	monster = EntityManager.createEntity('Creature');
	monster.x = 8*32;
	monster.y = 6*32;
	monster.range = 4;
	
	
	player = EntityManager.createEntity('Player');
	player.x = 4*32;
	player.y = 2*32;
	
	mover.moveMonster(monster, player);
	assertEquals(8*32, monster.x);
	assertEquals(6*32, monster.y);
	assertFalse(monster.isHostile);
}

/**
 * Testing out of range move, the monster locations should stay the same and isHostile = false.
 */
MoverTest.prototype.testMoveMonsterInRange = function() {
	mover = new Mover();
	monster = EntityManager.createEntity('Creature');
	monster.x = 12*32;
	monster.y = 8*32;
	monster.range = 6;
	
	
	player = EntityManager.createEntity('Player');
	player.x = 11*32;
	player.y = 3*32;
	
	mover.moveMonster(monster, player);
	assertTrue(monster.isHostile);
	assertEquals(12, monster.x/32);
	assertEquals(8, monster.y/32);
	
}

/**
 * Testing out of range move, the monster locations should stay the same and isHostile = false.
 */
MoverTest.prototype.testMoveMonsterInRange_Adjacent = function() {
	mover = new Mover();
	monster = EntityManager.createEntity('Creature');
	monster.x = 12*32;
	monster.y = 3*32;
	monster.range = 6;
	
	
	player = EntityManager.createEntity('Player');
	player.x = 11*32;
	player.y = 3*32;
	
	mover.moveMonster(monster, player);
	assertTrue(monster.isHostile);
	assertEquals(12, monster.x/32);
	assertEquals(3, monster.y/32); //Shouldent have moved because already there.
	
}


MoverTest.prototype.testGetRange= function() {
	creature = EntityManager.createEntity('Creature');
	creature.x = 8*32;
	creature.y = 6*32;
	
	mover = new Mover();
	
	player = EntityManager.createEntity('Player');
	player.x = 4*32;
	player.y = 2*32;
	
	dist = mover.getRange(player, creature);
	assertEquals('Expected distance between points should be 128',5,dist);
	
}

/**
 * See what's returned when items are adjacent both on axis and diaginal.
 */
MoverTest.prototype.testGetRange_AdjacentPoints= function() {

//TODO: Test on axis and diaginal
}

MoverTest.prototype.testStaticDirections= function() {
	assertEquals(0,Mover.MoveDir.UP);
	assertEquals(1,Mover.MoveDir.RIGHT_UP);
	assertEquals(2,Mover.MoveDir.RIGHT);
	assertEquals(3,Mover.MoveDir.RIGHT_DOWN);
	assertEquals(4,Mover.MoveDir.DOWN);
	assertEquals(5,Mover.MoveDir.LEFT_DOWN);
	assertEquals(6,Mover.MoveDir.LEFT);
	assertEquals(7,Mover.MoveDir.LEFT_UP);
	//RIGHT_UP":1,"RIGHT":2,"RIGHT_DOWN":3,"DOWN":4,"LEFT_DOWN":5,"LEFT":6,"LEFT_UP":7
}

MoverTest.prototype.testDetermineDirection= function() {
	var pRow = 2;
	var pCol = 4;
	var player = EntityManager.createEntity('Player');
	player.x = pCol*32;
	player.y = pRow*32;
	
	var targetDown = moverTestMap.getTile(pRow+1,pCol);
	var targetUp = moverTestMap.getTile(pRow-1,pCol);
	var targetLeft = moverTestMap.getTile(pRow,pCol-1);
	var targetDownRight = moverTestMap.getTile(pRow+1,pCol+1);
	
	
	var dir = Mover.determineDirection(player, targetDown);
	assertEquals(Mover.MoveDir.DOWN, dir);
	
	var dir = Mover.determineDirection(player, targetUp);
	assertEquals(Mover.MoveDir.UP, dir);
	
	var dir = Mover.determineDirection(player, targetLeft);
	assertEquals(Mover.MoveDir.LEFT, dir);
	
	var dir = Mover.determineDirection(player, targetDownRight);
	assertEquals(Mover.MoveDir.RIGHT_DOWN, dir);
}
