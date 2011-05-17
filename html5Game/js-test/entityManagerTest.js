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
	assertTrue('creature obj chould have x,y properties',(creature.hasOwnProperty('x') && creature.hasOwnProperty('y')));
	assertTrue('creature obj chould have deadImg, hp properties from alive component',(creature.hasOwnProperty('deadImg') && creature.hasOwnProperty('hp')));
	
	//FYI - console provided by jstestdriver!
	jstestdriver.console.log("EntityManagerTest", "Hello World!");
}


EntityManagerTest.prototype.testInitMapTile = function() {
	mapTile = manager.createEntity('MapTile');
	assertNotNull('MapTile should not be null',mapTile);
	assertTrue('mapTile should have initMapTile function.actual==',(typeof mapTile.init == 'function'));
	
}