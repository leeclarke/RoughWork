/**
 * Entity Factory responsable for creating all types of game objects by injecting components and object nature.
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
EntityManager.createEntity = function(entityType){
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
			entity.visable = false;
			return entity;
		case 'MapTile':
			entity = new Entity(entityType);
			entity.explored = false;
			entity.x = 0;
			entity.y = 0;
			entity.col = 0;
			entity.row = 0;
			entity.width = 0;
			entity.height = 0;
			entity.init = initMapTile;
			return entity;
		case 'Arrow':
			entity = new Entity(entityType);
			
			return entity;
		case 'Weapon':
			entity = new Entity(entityType);
			addWeapon(entity);				
			return entity;
		case 'Armor':
			entity = new Entity(entityType);
					
			return entity;
	}
}

/**
 * Factory method which creates a Monster of the type requested. All Entities are of the type 'Creature' but 
 * are then configured to the Creature type.
 */
EntityManager.createCreature = function(creatureType){
	creature = this.createEntity('Creature');
	return creature;
}

/**
 * Generates Factory based on type;
 */
EntityManager.weaponFactory = function(type) {
	weapon = this.createEntity('Weapon');
	switch(type) {
		case 'Sword':
			return weapon;
		default:
			//Return Hands, the default.
			weapon.name = 'Bare Hands';
			weapon.description = "Just empty handed";
			weapon.weaponType = "Hands";
			weapon.damageThrown = 0;
			weapon.damage = 8;
			return weapon;
	}
}

/**
 * 
 */
function getDefaultWeapon() {
	return EntityManager.weaponFactory('Hands');	
}

/**
 * Adds a Weapon nature to the entity.
 */
function addWeapon(entity) {
	entity.name = "Sword";
	entity.description = "Plain old sword.";
	entity.weaponType = "Sword";
	entity.damageThrown = 0;
	entity.damage = 8;
	entity.magical = false;
	entity.attackAdj = 0;
	entity.toDMGMagicAdj = 0;
	entity.toHitMagicAdj = 0;
}

/**
 * 
 */
function addLocation(entity) {
	entity.x = 0; //test
	entity.y = 0;
	entity.getCol = function() {
		return ~~(this.x/GameEngine.currentMap.getTileWidth())
	}
	entity.getRow = function() {
		return ~~(this.y/GameEngine.currentMap.getTileHeight())
	}
}

function addCombatant(entity) {
	entity.level =1;
	entity.weaponWielded = {};
	entity.toHitAdj = function() {
		//TODO:
		return 0;
	}
	entity.getArmor = function() {
		//TODO:might just be property with entity having armor value.
		return 8;
	}
	entity.getAttackAdj = function() {
		return 0;//TODO:
	}
	entity.getMissiles = function() {
		//TODO:
	}
	entity.strToDmgAdj = function() {
		return 0; //TODO:
	}
	entity.getToDMGMajicAdj = function() {
		return 0; //TODO:
	}

	entity.attack = attackRules;	
}

/**
 * Give the Entity the Monster component set.
 */
function addMonster(entity) {
	entity.isHostile = false;
	entity.range = 1; //Number of tiles creature can see
	oneLastSwing = false;
}
/**
 * Add player components to entity.
 */
function addPlayer(entity) {
	entity.levelMax = 1;
	entity.hp = 8;
	entity.hpMax = 8;
	entity.str = 16;
	entity.strMax = 16;
	entity.pack = [];
	entity.vision = GameEngine.playerDefaltVisonRange; //number of tiles the player can see in any direction
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
	entity.aggression = 0; //non-agressive @ 0   //TODO: need to implement use of this.
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
	entity.renderImg = renderSprite;
}

/**
 * Technically doesn't render but, returns the correct image for rendering, controls animation output.
 */
function renderSprite(){
	if(this.alive == false)
		return this.deadImg;
	return this.spriteImg; //TODO: convert to anamation with an array of sprites
}


/**
 * Initiallize the map from stored data which should be int he format of {"id":0, "type":0}
 * Note: id should indicate the sprite image id. no idea what type ought to be..
 */
function initMapTile(data) {
	this.id = (data.hasOwnProperty('id'))?data.id:-1;
	this.type = (data.hasOwnProperty('type'))?data.type:-1;
		
}

/**
 * All creatures get treated the same in combat though the implementation for stats will vary.
 * places attack results string into games eventMesgs stack.
 */
function attackRules(entity) {
	rangeAttack = false;
	if(!this.weaponWielded.hasOwnProperty('type')){
		this.weaponWielded = getDefaultWeapon('Hands');
	}
	hitRoll = GameEngine.diceRoll(1, 20) + this.toHitAdj() + this.getAttackAdj() + this.weaponWielded.toHitMagicAdj;
	thac0 = 21 - this.level;
	console.log("hitRoll="+hitRoll + " thac0=" + thac0);
	if ((thac0 - entity.getArmor()) <= hitRoll)
	{
		dmg = 0;
		
		if (rangeAttack)
		{
			strAdj = ((this.weaponWielded.weaponType == 'crossbow') ? 0 : this.strToDmgAdj());

			dmgMislMod = 0;
			if (this.weaponWielded.weaponType == 'crossbow' || this.weaponWielded.weaponType == 'bow')
			{
				// Apply bolt/arrow adj
				dmgMislMod += this.getMissiles().getAttackAdj();
			}
			dmg = GameEngine.diceRoll(1,this.weaponWielded.damageThrown) + strAdj
					+ this.weaponWielded.attackAdj + dmgMislMod + this.toDMGMajicAdj;
		}
		else {
			dmg = GameEngine.diceRoll(1,this.weaponWielded.damage) + this.strToDmgAdj() + this.weaponWielded.attackAdj + this.weaponWielded.toDMGMagicAdj;
		}
		//TODO: Extract this to the Coming GameEngine object.
		if(this.entityType === 'Player'){
			GameEngine.addEventMessage("You hit the monster for " + dmg + "!\n");
		} else {
			GameEngine.addEventMessage("Monster hit you for " + dmg + "!\n");
		}
		entity.hp -= dmg;
		if(entity.hp <= 0){
			entity.alive = false; //Monsters get one last swing since the go second.
			if(entity.entityType === 'Creature') entity.oneLastSwing = true;
		}
	} else {
		if(this.entityType === 'Player'){
			GameEngine.addEventMessage("Your attack missed!");
		} else {
			GameEngine.addEventMessage("Monster missed!\n");
		}
	}
}
