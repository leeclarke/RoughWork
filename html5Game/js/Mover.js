/**
 * Mover, responsable for moving animate Entities.
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

Mover.prototype.moveMonster = function(monster, player) {
	//if distance is under range then do path
	//need to consider line of sight, when waking up a monster. a direct unblocked path is needed.
	
	
	//.1 get disntance to player.
	dist = this.getRange(player,monster);
	if(dist <= monster.range) {
		if(!monster.isHostile ) {
			//check line of sight and if in sight flip to hostile.
			monster.isHostile = true;
		}
		
		//Call aStar to get path and make first step
		
	}
	
	//TODO: move code into EntityManager
	//check range for player..
	//if spoted 
		//M has range weapon and in range ? attack : move
		
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

Mover.prototype.checkCollision = function(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
