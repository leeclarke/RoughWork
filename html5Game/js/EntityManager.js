//TODO: add monster move function here, it should dosight,  pathing and then move position.

/**
 * 
 */
function EntityManager() {
	EntityTypes = {'Player':'Player','MapTile':'MapTile','Arrow':'Arrow', 'Creature':'Creature'}
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
			entity.toString = toString;
			renderable(entity);
			return entity;
		case 'Creature':
			entity = new Entity(entityType);
			addLocation(entity);
			alive(entity);
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

/**
 * Give the Entity the Monster component set.
 */
function addMonster(entity) {
	entity.isHostile = false;
	entity.range = 1; //Number of tiles creature can see
	entity.attack = attackPlayer;
}
/**
 * 
 */
function addPlayer(entity) {
	entity.level = 1;
	entity.levelMax = 1;
	entity.pack = [];
	entity.attack = attackMonster;
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
 * Resolves attacks by the player on monsters
 */
function attackMonster(monster) {
	//TODO: Implement
}

/**
 * Resolves attacks on the player
 */
function attackPlayer(player) {
	//TODO: Implement	
}
