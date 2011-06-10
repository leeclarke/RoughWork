/**
 * Mover, responsable for moving animate Entities.
 * 
 * Requires:  astar.js
 */
function Mover(){
	
}

/** 
 * Static value that allows directional Indicator.
 */
Mover.MoveDir = {"UP":0,"RIGHT_UP":1,"RIGHT":2,"RIGHT_DOWN":3,"DOWN":4,"LEFT_DOWN":5,"LEFT":6,"LEFT_UP":7};
/** Defines the pixal adjustment to make on a move based on direction moved referenced in Move.MoveDir**/
Mover.Coordinates = [{"x":0,"y":-32},{"x":32,"y":-32},{"x":32,"y":0},{"x":32,"y":32},
					{"x":0,"y":32}, {"x":-32,"y":32},{"x":-32,"y":0},{"x":-32,"y":0}];
/**
 * Determine which direction entity is moving based on target tile.
 */
Mover.determineDirection = function(entity, targetTile) {
	var colDif =  (targetTile.getCol() - entity.getCol()); 
	if(colDif < 0) {
		colDif = colDif/(colDif*-1);
	} //convert to either -1, or 1 nomatter the dif.
	else if(colDif > 0) { 
		colDif = colDif/(colDif);
	}
	
	var rowDif = targetTile.getRow() - entity.getRow()
	if(rowDif < 0) {rowDif = rowDif/(rowDif*-1);}
	else if(rowDif > 0){ rowDif = rowDif/(rowDif);}
	
	if(rowDif <0) { //UP
		switch(colDif){
			case 1:
				return Mover.MoveDir.RIGHT_UP;
			case 0:
				return Mover.MoveDir.UP;
			case -1:
				return Mover.MoveDir.LEFT_UP;
		}
	} else if(rowDif >0){ //DOWN
		switch(colDif){
			case 1:
				return Mover.MoveDir.RIGHT_DOWN;
			case 0:
				return Mover.MoveDir.DOWN;
			
			case -1:
				return Mover.MoveDir.LEFT_DOWN;
		}
	} else {//0
		switch(colDif) {
			case 1:
				return Mover.MoveDir.RIGHT;
			case -1:
				return Mover.MoveDir.LEFT;
		}
	}	
}

/**
 * xDir, yDir pos or neg value to move.
 */
Mover.prototype.movePlayer = function(player, xDir, yDir, mvVector) {
	//use player location to get row,col of surrounding tiles.
	if(player.alive === false) {
		return;
	}
	var playerOldX = player.x;
	var playerOldY = player.y;
	player.x += xDir;
	player.y += yDir;
	
	if(this.offMap(player)) {
		player.x = playerOldX;
		player.y = playerOldY;
		return;
	}

	//get targeted tile.
	var targetTile = GameEngine.currentMap.getTile(player.getRow(),player.getCol());
	if(targetTile !== null) {
		var colls = this.checkCollision(player, targetTile);
		if(colls) {//looks like there would always be a collision so the question is, does this offer anything?
			//TODO: add logic for checking variables involved in diff tile types. doing simple 0|1 for now.
			//if collision, see if blocked.
			if(!targetTile.hasOwnProperty('type') || targetTile.type === GameEngine.currentMap.movementAttributes.unpassable) {
				//blocked
				player.x = playerOldX;
				player.y = playerOldY;
				return;
			}
			//check monster Collision.
			for(m = 0; m < GameEngine.monsters.length; m++) {
				if(this.checkCollision(GameEngine.player,GameEngine.monsters[m]) && GameEngine.monsters[m].alive === true) {
					//blocked
					player.x = playerOldX;
					player.y = playerOldY;
					//TODO: Add mouse click support.
					
					if(mvVector !== null) {
						GameEngine.player.currentSequence = GameEngine.player.spriteManager.getSequenceSpriteByDirection(mvVector).name;
					}
					
					player.attack(GameEngine.monsters[m]);
					return;
				}
			}
		} 
	}
};

/**
 * Move the monster towards the player if in range or attack if can.
 */
Mover.prototype.moveMonster = function(monster, player) {
	//need to consider line of sight, when waking up a monster. a direct unblocked path is needed.

	var dist = this.getRange(player,monster);
	if(dist <= monster.range) {
		if(monster.alive === false){
			if(monster.oneLastSwing === true) {
				monster.isHostile = true;
				monster.oneLastSwing = false;	
				monster.attack(player);
				return;
			} else {
				return;
			}
		}
		var path = a_star(monster, player, GameEngine.currentMap);

//TODO: M has range weapon and in range ? attack : move
		if(path && path.length >2 && path.length <= monster.range){
			monster.isHostile = true;
			///make sure there isnt a monster in the target location.. 
			///Might be more efficent to mark the tile as occupied?
			var tileClear = true;
			var newPos = {"x":(path[1].x*GameEngine.currentMap.tileMapManager.tileWidth), "y":(path[1].y*GameEngine.currentMap.tileMapManager.tileHeight)};
			for(mn = 0; mn < GameEngine.monsters.length; mn++) {
				if(GameEngine.monsters[mn].x === newPos.x && GameEngine.monsters[mn].y === newPos.y){
					tileClear = false; break;
				}
			}  
			if(tileClear) { 
				monster.x = path[1].x*GameEngine.currentMap.tileMapManager.tileWidth;
				monster.y = path[1].y*GameEngine.currentMap.tileMapManager.tileHeight;
			} else {
				//Try ranged attack.
			}
		} else if(path.length <= 2){
			//make hostile incase this is first encouter cuz of teleport etc..
			monster.isHostile = true;
			monster.attack(player);
		}
	}		
};

/**
 * This returns the distance to the other point rounded down if not a whole number. This just helps determine if 
 * the creature could even see the player before trying to determine a path, hopefully saving time in computing 
 * when there are many monsters on the map.
 * 
 */
Mover.prototype.getRange = function (point1,point2){
	 var dx = (point2.x/32)-(point1.x/32);
	 var dy = (point2.y/32)-(point1.y/32);
	 var dist = ~~(Math.sqrt((dx*dx) + (dy*dy)));
	 return dist;
};

/**
 * clamp object to map so it cant ever get outside the map bounds.
 * @return true if if  
 */
Mover.prototype.offMap = function(entity){
	return (entity.x <0 || entity.y <0 || entity.x > GameEngine.currentMap.width || entity.y > GameEngine.currentMap.height);
};

/**
 * Returns true if two entities collide or overlap.
 */
Mover.prototype.checkCollision = function(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
};
