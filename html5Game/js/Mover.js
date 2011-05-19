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

Mover.prototype.moveMonster_ = function() {
	//simply iterate the monsters and if distance is under range then do path
	//need to consider line of sight, when waking up a monster. a direct unblocked path is needed.
	
	
	
	//TODO: move code into EntityManager
	//check range for player..
	//if spoted 
		//M has range weapon and in range ? attack : move
		
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
