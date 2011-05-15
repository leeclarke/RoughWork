function EntityManager() {
	EntityTypes = {'Player':'Player','Arrow':'Arrow'};
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
			entity.toString = toString;
			renderable(entity);
			return entity;
		case 'Arrow':
			entity = new Entity(entityType);
			
			return entity;
			
			
	}
}

EntityManager.prototype.addComponent = function(compType){
	
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
	//out =  "["+ this.entityType +"] name="+ this.name + " location="+ this.x + "," + this.y;
	return out;
}

function renderable(entity) {
	entity.spriteImg = document.createElement('img');
	entity.width = 32;
	entity.height = 32;
}
