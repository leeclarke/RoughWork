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
			entity.toString = toString;
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
	entity.deadImg.src = "res/bones.png";  //Set a default. TODO: revisit this later.
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
	entity.spriteManager = null;
	entity.initSpriteManager = setupSpriteManager;
	entity.currentSequence = null;
	entity.currentSequenceStep = 0;
	entity.currentSequenceFrame = 0;
	entity.drawDeadSprite = drawDeadSprite;
}

/**
 * Initializes a sprite sheet for a given entity to provide support for animations.
 * @param spriteManagerConfig - config defining the sprites contined in a sprite sheet.
 * @param animationSequences - object containing sequences that reference tiles defined in the spriteManagerConfig
 */
function setupSpriteManager(spriteManagerConfig, animationSequences) {
	this.spriteManager = new SpriteTileManager(spriteManagerConfig);
	this.spriteManager.initAnimationSeqs(animationSequences);
}

/**
 * Renders the Dead Entitys sprite,or sequence from the spriteManager or spriteImg if no 'DEAD'
 * sprite is defined in the spriteManager. 
 */
function drawDeadSprite(context,x,y, entity) {
	if(entity.spriteManager.getSequenceSprite("DEAD",0) !== null) {
		if(entity.currentSequence != "DEAD"){
			entity.currentSequence = "DEAD";
			entity.currentSequenceStep = 0;
			entity.currentSequenceFrame = 0;
		}
		var deadSpriteData = entity.spriteManager.getSequenceSprite(entity.currentSequence, entity.currentSequenceStep);
		//call AnimateSprite funciton
	}
	if(entity.spriteManager.getNamedTile("DEAD") !== null) {
		var deadSpriteData = entity.spriteManager.getNamedTile("DEAD");
		deadSprite = entity.spriteManager.tileOrgPoint(deadSpriteData.col,deadSpriteData.row);
		context.drawImage(entity.spriteManager.spriteImage, deadSprite.xPos , deadSprite.yPos, entity.spriteManager.tileWidth, entity.spriteManager.tileHeight, x, y, entity.spriteManager.tileWidth, entity.spriteManager.tileHeight);
	} else {
		context.drawImage(entity.deadImg, x, y);
	}	
};

/**
 * Renders correct sprite to the games context.
 */
function renderSprite(context, x,y){
	if(this.alive === false) {
		drawDeadSprite(context,x,y,this);
		return;
	}
	
	if(this.spriteManager != null && this.spriteManager.spriteImage.imageLoaded ) {
		if(this.currentSequence != null){
			var spriteData =  this.spriteManager.getSequenceSprite(this.currentSequence, this.currentSequenceStep);
			animate(context, x, y, this, spriteData);
		return;
		}else{
			defaultSprite = this.spriteManager.namedTileOrgPoint(0);
			context.drawImage(this.spriteManager.spriteImage, defaultSprite.xPos , defaultSprite.yPos, this.spriteManager.tileWidth, this.spriteManager.tileHeight, x, y, this.spriteManager.tileWidth,this.spriteManager.tileHeight);
			return;
		}
	}
	return this.spriteImg;
}

/**
 * Keeps track of the animation sequence and renders the sprite to the context.
 * 
 */
function animate(context, x, y, entity, spriteData) {
	var spriteId = 0;
	var defaultSprite;
	if(spriteData == null) { //sequence is over, return default.
		entity.currentSequence = null;
		entity.currentSequenceStep = 0;
		entity.currentSequenceFrame = 0;
		defaultSprite = entity.spriteManager.namedTileOrgPoint(spriteId);
	} else {
		spriteId = spriteData.sequence[entity.currentSequenceStep];
		if(entity.currentSequenceFrame != 0 && (entity.currentSequenceFrame%spriteData.sequenceFrameDuration)==0) {
			entity.currentSequenceStep++;
		}
		entity.currentSequenceFrame++;
		defaultSprite = entity.spriteManager.namedTileOrgPoint(spriteId);
	}
	
	context.drawImage(entity.spriteManager.spriteImage, defaultSprite.xPos , defaultSprite.yPos, entity.spriteManager.tileWidth, entity.spriteManager.tileHeight, x, y, entity.spriteManager.tileWidth, entity.spriteManager.tileHeight);
};

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
