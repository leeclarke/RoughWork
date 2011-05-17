//TODO: add monster move function here, it should dosight,  pathing and then move position.
/**
 * 
 */
function EntityManager() {
	EntityTypes = {'Player':'Player','Arrow':'Arrow', 'Creature':'Creature'};
}

function Entity(type){
	this.entityType = type;
}

 /**
  * 
  */
EntityManager.prototype.createEntity = function(entityType){
	
	switch(entityType) {
		case 'Player':
			entity = new Entity(entityType);
			location(entity);
			alive(entity);
			entity.toString = toString;
			renderable(entity);
			return entity;
		case 'Creature':
			entity = new Entity(entityType);
			location(entity);
			alive(entity);
			entity.toString = toString;
			renderable(entity);
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

function monster(entity) {
	entity.isHostile = false;
	entity.range = 1; //Number of tiles creature can see
}

/**
 * Add properties and functionality for things that can be killed.
 */
function alive(entity) {
	entity.alive = true;
	entity.hp = 1;
	entity.deadImg = document.createElement('img');
	entity.aggression = 0; //non-agressive @ 0
}

function location(entity) {
	entity.x = 0;
	entity.y = 0;
	
}

function stats(entity) {
	entity.name = "";
}

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

function renderable(entity) {
	entity.spriteImg = document.createElement('img');
	entity.width = 32;
	entity.height = 32;
	entity.renderImg = renderImg;
}

/**
 * Technically doesn't render but returns the correct image for rendering, controls animation output.
 */
function renderImg(){
	//TODO: convert to anamation with an array of sprites
	return this.spriteImg;
}
