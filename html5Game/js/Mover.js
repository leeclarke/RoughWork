/**
 * Mover, responsable for moving animate Entities.
 * 
 * Requires:  astar.js
 */
function Mover(){
	
	
}

/**
 * xDir, yDir pos or neg value to move.
 */
Mover.prototype.movePlayer = function(player, xDir, yDir) {
	//use player location to get row,col of surrounding tiles.
	playerOldX = player.x;
	playerOldY = player.y;
	player.x += xDir;
	player.y += yDir;
	
	if(this.offMap(player, tiledMap)) {
		player.x = playerOldX;
		player.y = playerOldY;
		return;
	}
	
	mapCol = ~~(player.x/tileWidth)
	mapRow = ~~(player.y/tileHeight)
	//get 8 surrounding tiles and check for collision.
	surroundingTile = tiledMap.getRange(mapRow,mapCol, 3,3);
	//Look for collision if so see if blocked.
	for(t in surroundingTile){
		tile = surroundingTile[t];
		colls = this.checkCollision(player, tile);
		if(colls) {
			//TODO: add logic for checking variables involved in diff tile types. doing simple 0|1 for now.
			//if collision, see if blocked.
			if(!tile.hasOwnProperty('type') || tile.type == 0) {
				//blocked
				player.x = playerOldX;
				player.y = playerOldY;
				break;
			}
			
			//check monster Collision.
			for(m in monsters) {
				if(this.checkCollision(player,monsters[m])) {
					//blocked
					player.x = playerOldX;
					player.y = playerOldY;
					break;
				}
			}
			
		}
	}
}

/**
 * Move the monster towards the player if in range or attack if can.
 */
Mover.prototype.moveMonster = function(monster, player) {
	//if distance is under range then do path
	//need to consider line of sight, when waking up a monster. a direct unblocked path is needed.

	dist = this.getRange(player,monster);
	if(dist <= monster.range) {
		if(!monster.isHostile ) {
			//TODO: check line of sight and if in sight flip to hostile.
			monster.isHostile = true;
		}
		
		//Call aStar to get path and make first step
		path = a_star(monster, player, tiledMap);
//TODO: M has range weapon and in range ? attack : move
		if(path && path.length >0){
			monster.x = path[0].x;
			monster.y = path[0].y;
		} else {
			//If path length is 0 then adjacent to player, club him!
//TODO:
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
	 dist = Math.sqrt((dx*dx) + (dy*dy));
	 return ~~(dist);
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
