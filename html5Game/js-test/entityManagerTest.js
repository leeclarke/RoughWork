EntityManagerTest = TestCase("EntityManagerTest");
var manager = new EntityManager();
var eventMesgs = [];

EntityManagerTest.prototype.testGetPlayerEntity = function() {
	player = manager.createEntity('Player');
	assertNotNull('Player should not be null',player);
	assertTrue('Player obj chould have x,y properties',(player.hasOwnProperty('x') && player.hasOwnProperty('y')));
	assertTrue('player should have spriteImg property.',player.hasOwnProperty('spriteImg'));
	assertTrue('player should have width and height properties',player.hasOwnProperty('width') && player.hasOwnProperty('height'));
	assertTrue('player obj should have function.attack==',(typeof player.attack == 'function'));
	assertTrue('player obj should have function.toHitAdj==',(typeof player.toHitAdj == 'function'));
	assertTrue('player obj should have function.getArmor==',(typeof player.getArmor == 'function'));
	assertTrue('player obj should have level property',player.hasOwnProperty('level'));
	assertTrue('player obj should have function.getAttackAdj==',(typeof player.getAttackAdj == 'function'));
}; 


EntityManagerTest.prototype.testGetCreature = function() {
	creature = manager.createEntity('Creature');
	assertNotNull('creature should not be null',creature);
	assertTrue('creature obj should have x,y properties',(creature.hasOwnProperty('x') && creature.hasOwnProperty('y')));
	assertTrue('creature obj should have deadImg, hp properties from alive component',(creature.hasOwnProperty('deadImg') && creature.hasOwnProperty('hp')));
	assertTrue('creature obj should have range, isHostile properties',(creature.hasOwnProperty('range') && creature.hasOwnProperty('isHostile')));
	assertTrue('creature obj should have function.attack==',(typeof creature.attack == 'function'));
	assertTrue('creature obj should have function.toHitAdj==',(typeof creature.toHitAdj == 'function'));
	assertTrue('creature obj should have function.getArmor==',(typeof creature.getArmor == 'function'));
	assertTrue('creature obj should have level property',creature.hasOwnProperty('level'));
	assertTrue('creature obj should have function.getAttackAdj==',(typeof creature.getAttackAdj == 'function'));
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

EntityManagerTest.prototype.testGEtWeapon= function() {
	weapon = manager.createEntity('Weapon');
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

	testWeapon = manager.createEntity('Weapon')
	player = manager.createEntity('Player');
	player.weaponWielded = testWeapon;
	
	creature = manager.createEntity('Creature');
	creature.weaponWielded = testWeapon;
	//TOOD: This failes int he tester for soe reason.
	player.attack(creature);
	
	for(e in eventMesgs) {
		jstestdriver.console.log("EntityManagerTest", "Attack Results="+eventMesgs[e]);
	}
}
