EntityManagerTest = TestCase("EntityManagerTest");

var eventMesgs = [];
//SetUp
if(GameEngine.currentMap == null) {
	GameEngine.currentMap = new TiledMap(600, 600, 32, 32);
	GameEngine.currentMap.tileMapManager = new SpriteTileManager(null,32,32);
}

//TODO: Add createEntityTest for each Type.

EntityManagerTest.prototype.testGetPlayerEntity = function() {
	player = EntityManager.createEntity('Player');
	assertNotNull('Player should not be null',player);
	assertTrue('Player obj chould have x,y properties',(player.hasOwnProperty('x') && player.hasOwnProperty('y')));
	assertTrue('player should have spriteImg property.',player.hasOwnProperty('spriteImg'));
	assertTrue('player should have width and height properties',player.hasOwnProperty('width') && player.hasOwnProperty('height'));
	assertTrue('player obj should have function.attack==',(typeof player.attack == 'function'));
	assertTrue('player obj should have function.toHitAdj==',(typeof player.toHitAdj == 'function'));
	assertTrue('player obj should have function.getArmor==',(typeof player.getArmor == 'function'));
	assertTrue('player obj should have function.renderImg==',(typeof player.renderImg == 'function'));
	assertTrue('player obj should have level property',player.hasOwnProperty('level'));
	assertTrue('player obj should have function.getAttackAdj==',(typeof player.getAttackAdj == 'function'));
	assertTrue('player obj should have function.getCol==',(typeof player.getCol == 'function'));
	assertTrue('player obj should have function.getRow==',(typeof player.getRow == 'function'));
	
	//test get col/row
	player.x = (3*32);
	player.y = (4*32);
	assertEquals('getCol expected col 3',3,player.getCol());
	assertEquals('getCol expected col 4',4,player.getRow());
}; 

EntityManagerTest.prototype.testCreateCreature = function() {
	creature = EntityManager.createCreature('Creature');
	assertNotNull('creature should not be null',creature);
	assertTrue('creature obj should have x,y properties',(creature.hasOwnProperty('x') && creature.hasOwnProperty('y')));
	assertTrue('creature obj should have deadImg, hp properties from alive component',(creature.hasOwnProperty('deadImg') && creature.hasOwnProperty('hp')));
	assertTrue('creature obj should have range, isHostile properties',(creature.hasOwnProperty('range') && creature.hasOwnProperty('isHostile')));
	assertTrue('creature obj should have function.attack==',(typeof creature.attack == 'function'));
	assertTrue('creature obj should have function.toHitAdj==',(typeof creature.toHitAdj == 'function'));
	assertTrue('creature obj should have function.getArmor==',(typeof creature.getArmor == 'function'));
	assertTrue('creature obj should have level property',creature.hasOwnProperty('level'));
	assertTrue('creature obj should have function.getAttackAdj==',(typeof creature.getAttackAdj == 'function'));
	assertTrue('creature obj should have function.renderImg==',(typeof player.renderImg == 'function'));
}


EntityManagerTest.prototype.testInitMapTile = function() {
	testTileData = {"id":2, "type":2};
	mapTile = EntityManager.createEntity('MapTile');
	
	assertNotNull('MapTile should not be null',mapTile);
	assertTrue('mapTile should have function.init==',(typeof mapTile.init == 'function'));
	//Test loading of data.
	mapTile.init(testTileData);
	assertTrue('MapTile should have property "id".',mapTile.hasOwnProperty('id'));
	assertTrue('MapTile should have property "type".',mapTile.hasOwnProperty('type'));
	assertTrue('MapTile should have property "y".',mapTile.hasOwnProperty('y'));
	assertTrue('MapTile should have property "x".',mapTile.hasOwnProperty('x'));
	assertTrue('MapTile should have property "col".',mapTile.hasOwnProperty('col'));
	assertTrue('MapTile should have property "row".',mapTile.hasOwnProperty('row'));
	assertTrue('MapTile should have property "width".',mapTile.hasOwnProperty('width'));
	assertTrue('MapTile should have property "height".',mapTile.hasOwnProperty('height'));
	assertTrue('MapTile should have property "explored".',mapTile.hasOwnProperty('explored'));
	
	assertEquals(2,mapTile.id);
	assertEquals(2,mapTile.type);
	
}

EntityManagerTest.prototype.testWeaponFactory= function() {
	weapon = EntityManager.weaponFactory('Weapon');
	assertTrue('weapon obj should have property: name',weapon.hasOwnProperty('name'));
	assertTrue('weapon obj should have property: description',weapon.hasOwnProperty('description'));
	assertTrue('weapon obj should have property: weaponType',weapon.hasOwnProperty('weaponType'));
	assertTrue('weapon obj should have property: damageThrown',weapon.hasOwnProperty('damageThrown'));
	assertTrue('weapon obj should have property: damage',weapon.hasOwnProperty('damage'));
	assertTrue('weapon obj should have property: magical',weapon.hasOwnProperty('magical'));
	assertTrue('weapon obj should have property: attackAdj',weapon.hasOwnProperty('attackAdj'));
	assertTrue('weapon obj should have property: toDMGMagicAdj',weapon.hasOwnProperty('toDMGMagicAdj'));
	assertTrue('weapon obj should have property: toHitMagicAdj',weapon.hasOwnProperty('toHitMagicAdj'));
	
}

EntityManagerTest.prototype.testAttackRules = function() {

	testWeapon = EntityManager.createEntity('Weapon');
	player = EntityManager.createEntity('Player');
	player.weaponWielded = testWeapon;
	
	creature = EntityManager.createEntity('Creature');
	creature.weaponWielded = testWeapon;

	player.attack(creature);
	
	while(eventMesgs.length >0) {
		e = eventMesgs.pop();
		jstestdriver.console.log("EntityManagerTest", "Attack Results=" + e);
	}
}
