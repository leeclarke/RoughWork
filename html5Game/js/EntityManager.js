//TODO: add monster move function here, it should dosight,  pathing and then move position.

/**
 * 
 */
function EntityManager() {
	EntityTypes = {'Player':'Player','MapTile':'MapTile','Arrow':'Arrow', 'Creature':'Creature', 'Weapon':'Weapon', 'Armor':'Armor'}
}

function Entity(type){
	this.entityType = type;
}

 /**
  * Creates an Entity of the requested type. Types are publicly defined in EntityManager.EtityTypes Map.
  */
EntityManager.prototype.createEntity = function(entityType){
	switch(entityType) {
		case 'Player':
			entity = new Entity(entityType);
			addLocation(entity);
			alive(entity);
			addPlayer(entity);
			addCombatant(entity);
			entity.toString = toString;
			renderable(entity);
			return entity;
		case 'Creature':
			entity = new Entity(entityType);
			addLocation(entity);
			alive(entity);
			addCombatant(entity);
			entity.toString = toString;
			renderable(entity);
			addMonster(entity);
			return entity;
		case 'MapTile':
			entity = new Entity(entityType);
			entity.init = initMapTile;
			return entity;
		case 'Arrow':
			entity = new Entity(entityType);
			
			return entity;
	}
}

/**
 * Factory method which creates a Monster of the type requested. All Entities are of the type 'Creature' but 
 * are then configured to the Creature type.
 */
EntityManager.prototype.createCreature = function(creatureType){
	creature = this.createEntity('Creature');
	return creature;
}

/**
 * 
 */
function addLocation(entity) {
	entity.x = 0; //test
	entity.y = 0;
}

function addCombatant(entity) {
	entity.level =1;
	entity.getWeaponWielded = function(){
		
	}
	entity.toHitAdj = function() {
		//TODO:
	}
	entity.getArmor = function() {
		//TODO:
	}
	entity.getAttackAdj = function() {
		//TODO:
	}
	entity.getMissiles = function() {
		//TODO:
	}
	entity.strToDmgAdj = function() {
		//TODO:
	}
	entity.getToDMGMajicAdj = function() {
		//TODO:
	}
	
	
	 
	entity.attack = attack;
}

/**
 * Give the Entity the Monster component set.
 */
function addMonster(entity) {
	entity.isHostile = false;
	entity.range = 1; //Number of tiles creature can see
}
/**
 * 
 */
function addPlayer(entity) {
	entity.level = 1;
	entity.levelMax = 1;
	entity.pack = [];
}

/**
 * Add properties and functionality for things that can be killed.
 */
function alive(entity) {
	entity.alive = true;
	entity.hp = 1;
	entity.hpMax = 1;
	entity.str = 1;
	entity.strMax = 1;
	entity.deadImg = document.createElement('img');
	entity.aggression = 0; //non-agressive @ 0
}



function stats(entity) {
	entity.name = "";
}

/**
 * Add to any entity for debugging.
 */
function toString() {
	out =  "["+ this.entityType +"] ";
	for(var prop in this)
	{
		if(this.hasOwnProperty(prop) && prop != 'toString') {
			var type = typeof prop;
			out += (prop + " = " + this[prop] + " , ");
		}
	}
	return out;
}

/**
 * Entity is able to be rendered to the screen.
 */
function renderable(entity) {
	entity.spriteImg = document.createElement('img');
	entity.width = 32;
	entity.height = 32;
	entity.renderImg = renderImg;
}

/**
 * Technically doesn't render but, returns the correct image for rendering, controls animation output.
 */
function renderImg(){
	//TODO: convert to anamation with an array of sprites
	return this.spriteImg;
}


/**
 * Initiallize the map from stored data which should be int he format of {"id":0, "type":0}
 * Note: id should indicate the sprite image id. no idea what type ought to be..
 */
function initMapTile(data) {
	this.id = data.id;
	this.type = data.type;
}

/**
 * All creatures get treated the same in combat though the implementation for stats will vary.
 */
function attack(entity) {
	/*
	 * determine chance to hit
	 * make roll
	 * roll dmg
	 * factor adjustments 
	 * dole out dmg return resuts
	 */
	 hitRoll = Math.rollDice(1, 20) + monster.toHitAdj()
				+ monster.getAttackAdj();
	 thac0 = 21 - monster.level;
	 if ((thac0 - this.getArmor()) < hitRoll)
	 {
		dmg = 0;
		if (isRangeAttack)
		{
			strAdj = ((this.getWeaponWielded().getWeaponType() == 'crossbow') ? 0 : this.strToDmgAdj());

			dmgMislMod = 0;
			if (this.getWeaponWielded().getWeaponType() == 'crossbow' || this.getWeaponWielded().getWeaponType() == 'bow')
			{
//TODO: add implied functions for armor,weapons etc
				// Apply bolt/arrow adj
				dmgMislMod += this.getMissiles().getAttackAdj();
			}
			dmg = Math.rollDice(this.getWeaponWielded().getDamageThrown()) + strAdj
					+ this.getWeaponWielded().getAttackAdj() + dmgMislMod
					+ this.getToDMGMajicAdj();
		}
		else
			dmg = Math.rollDice(this.getWeaponWielded().getDamage()) + this.strToDmgAdj()
					+ this.getWeaponWielded().getAttackAdj() + this.getToDMGMajicAdj();
		eventMesgs.push("You hit the monster for " + dmg + "!\n");
		entity.hp -= dmg;
		if(entity.hp <= 0){
			entity.alive = false; //Monsters get one last swing since the go second.
			if(entity.type === 'creature') entity.oneLastSwing = true;
		}
	 }
}

