EntityManagerTest = TestCase("EntityManagerTest");
var manager = new EntityManager();

EntityManagerTest.prototype.testGetPlayerEntity = function() {
	
	player = manager.createEntity('Player');
	assertNotNull('Player should not be null',player);
	assertTrue('Player obj chould have x,y properties',(player.hasOwnProperty('x') && player.hasOwnProperty('y')));
	assertTrue('player should have spriteImg property.',player.hasOwnProperty('spriteImg'));
	assertTrue('player should have width and height properties',player.hasOwnProperty('width') && player.hasOwnProperty('height'));
}; 


EntityManagerTest.prototype.testGetCreature = function() {
	creature = manager.createEntity('Creature');
	assertNotNull('creature should not be null',creature);
	assertTrue('creature obj should have x,y properties',(creature.hasOwnProperty('x') && creature.hasOwnProperty('y')));
	assertTrue('creature obj should have deadImg, hp properties from alive component',(creature.hasOwnProperty('deadImg') && creature.hasOwnProperty('hp')));
	assertTrue('creature obj should have range, isHostile properties',(creature.hasOwnProperty('range') && creature.hasOwnProperty('isHostile')));
}


EntityManagerTest.prototype.testInitMapTile = function() {
	testTileData = {"id":2, "type":2};
	mapTile = manager.createEntity('MapTile');
	
	assertNotNull('MapTile should not be null',mapTile);
	assertTrue('mapTile should have initMapTile function.actual==',(typeof mapTile.init == 'function'));
	//Test loading of data.
	mapTile.init(testTileData);
	assertTrue('MapTile should have property "id".',mapTile.hasOwnProperty('id'));
	assertTrue('MapTile should have property "type".',mapTile.hasOwnProperty('type'));
	
}

