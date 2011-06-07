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

/**
 * xDir, yDir pos or neg value to move.
 */
Mover.prototype.movePlayer = function(player, xDir, yDir, mvVector) {
	//use player location to get row,col of surrounding tiles.
	if(player.alive == false)
		return;
	playerOldX = player.x;
	playerOldY = player.y;
	player.x += xDir;
	player.y += yDir;
	
	if(this.offMap(player, tiledMap)) {
		player.x = playerOldX;
		player.y = playerOldY;
		return;
	}

	//get targeted tile.
	targetTile = tiledMap.getTile(player.getRow(),player.getCol());
	if(targetTile !== null) {
		colls = this.checkCollision(player, targetTile);
		if(colls) {//looks like there would always be a collision so the question is, does this offer anything?
			//TODO: add logic for checking variables involved in diff tile types. doing simple 0|1 for now.
			//if collision, see if blocked.
			if(!targetTile.hasOwnProperty('type') || targetTile.type === tiledMap.movementAttributes["unpassable"]) {
				//blocked
				player.x = playerOldX;
				player.y = playerOldY;
				return;
			}
			//check monster Collision.
			for(m in GameEngine.monsters) {
				if(this.checkCollision(GameEngine.player,GameEngine.monsters[m]) && GameEngine.monsters[m].alive === true) {
					//blocked
					player.x = playerOldX;
					player.y = playerOldY;
					//TODO: Add mouse click support.
					
					if(mvVector != null) {
						GameEngine.player.currentSequence = GameEngine.player.spriteManager.getSequenceSpriteByDirection(mvVector).name;
					}
					
					player.attack(GameEngine.monsters[m]);
					return;
				}
			}
		} 
	}
}

/**
 * Move the monster towards the player if in range or attack if can.
 */
Mover.prototype.moveMonster = function(monster, player) {
	//need to consider line of sight, when waking up a monster. a direct unblocked path is needed.

	dist = this.getRange(player,monster);
	if(dist <= monster.range) {
		if(monster.alive === false){
			if(monster.oneLastSwing == true) {
				monster.isHostile = true;
				monster.oneLastSwing = false;
				monster.attack(player);
				return;
			} else {
				return;
			}
		}
		path = a_star(monster, player, tiledMap);

//TODO: M has range weapon and in range ? attack : move
		if(path && path.length >2 && path.length <= monster.range){
			monster.isHostile = true;
			///make sure there isnt a monster in the target location.. 
			///Might be more efficent to mark the tile as occupied?
			tileClear = true;
			newPos = {"x":(path[1].x*tiledMap.tileMapManager.tileWidth), "y":(path[1].y*tiledMap.tileMapManager.tileHeight)};
			for(mn in GameEngine.monsters) {
				if(GameEngine.monsters[mn].x === newPos.x && GameEngine.monsters[mn].y === newPos.y){
					tileClear = false; break;
				}
			}  
			if(tileClear) { 
				monster.x = path[1].x*tiledMap.tileMapManager.tileWidth;
				monster.y = path[1].y*tiledMap.tileMapManager.tileHeight;
			} else {
				//Try ranged attack.
			}
		} else if(path.length <= 2){
			//make hostile incase this is first encouter cuz of teleport etc..
			monster.isHostile = true;
			monster.attack(player);
		}
	}		
}

/**
 * This returns the distance to the other point rounded down if not a whole number. This just helps determine if 
 * the creature could even see the player before trying to determine a path, hopefully saving time in computing 
 * when there are many monsters on the map.
 * 
 */
Mover.prototype.getRange = function (point1,point2){
	 dx = (point2.x/32)-(point1.x/32);
	 dy = (point2.y/32)-(point1.y/32);
	 dist = ~~(Math.sqrt((dx*dx) + (dy*dy)));
	 return dist;
}

/**
 * clamp object to map so it cant ever get outside the map bounds.
 * @return true if if  
 */
Mover.prototype.offMap = function(entity, tiledMap){
	return (entity.x <0 || entity.y <0 || entity.x > tiledMap.width || entity.y > tiledMap.height);
}

/**
 * Returns true if two entities collide or overlap.
 */
Mover.prototype.checkCollision = function(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
