
/**
 * @object SpriteTileManager
 * Manages Retriaval of sprites from a single img source. 
 * 
 * TODO: RESEARCH: For performance reasons it might be best if one SpriteManager was created per game 
 *		 and all sprites were in one image file, would this be best for download? 
 */
function SpriteTileManager(config, tileW, tileH, src) {
	this.animationSequences = null;
	this.spriteImgBuffer = document.createElement('canvas');
	this.bufferCtx = this.spriteImgBuffer.getContext('2d');
	this.spriteImage = document.createElement('img');
	this.spriteImage.onload = function() {
		this.imageLoaded = true;
		console.log("Image loaded! " + this.src);
	}
	if(config){
		this.tileWidth = (config.tileWidth)?config.tileWidth:0;
		this.tileHeight = (config.tileHeight)?config.tileHeight:0;
		this.namedTiles = (config.namedTiles)?config.namedTiles:[];
		if(!config.src) {
			throw "missing src value in config. check you config.";
		}
		this.spriteImage.src = config.src;		
	} else{
		this.tileWidth = (tileW)?tileW:0;
		this.tileHeight = (tileH)?tileH:0;
		this.namedTiles = {};
		this.spriteImage.src = src;	
	}
}


/**
 * Sets up the animation sequences and validates that they do actually reference configured sprites.
 * @param animation sequence configuration in JSON format.   ex. [{"name":"attack_left",
 *		"sequence":[6,5,4,5,6,7,6,0], 
 *		"sequenceFrameDuration":2}]
 * @throws - error if the namedTiles has no sprites defined. Means the tile config hasnt been set.
 */
SpriteTileManager.prototype.initAnimationSeqs = function(config) {
	if(this.namedTiles.length >0 && config.length > 0) {
		this.animationSequences = [];
		for(s = 0; s < config.length; s++) {
			var aSeq = config[s];
			//Validate the sequence then add to sequences.
			for(i = 0; i < aSeq.sequence.length ;i++) {
				;
				if(!this.getNamedTileById(aSeq.sequence[i])){
					throw "Invalid Sprite id:"+aSeq.sequence[i];
				}
			}
			this.animationSequences[aSeq.name] = aSeq;
		}
	} else {
		throw "No sprite tiles have been configured, the config should be included in the params when creating a new SpriteTileManager."
	}
}

/**
 * Given the animation sequence id and the sequence step, return img with sprite or null if number exceeds the length of sequence.
 * @param sequenceId - id or name of the sequence 
 * @param sequenceStep - position in the sequence wanted.
 * @return img with sprite or null if out of bounds.
 */
SpriteTileManager.prototype.getSequenceSprite = function(sequenceId, sequenceStep) {
	//get sequence /check step is < sequence.length , rturn null if > len
	var aniSeq = this.animationSequences[sequenceId];
	if(aniSeq == null || sequenceStep >= aniSeq.sequence.length ){
		return null;
	}
	return aniSeq;
}

/**
 * Retrieves a Sequence associated with a specified Mover.MoveDir
 */
SpriteTileManager.prototype.getSequenceSpriteByDirection = function(moverDir) {
	if(!(typeof(moverDir) === undefined)){	
		for(var prop in this.animationSequences) {
			if(!(typeof( this.animationSequences[prop]) === undefined) && this.animationSequences[prop].hasOwnProperty('direction') && this.animationSequences[prop].direction == moverDir) {
				return this.animationSequences[prop];
			}
		}
	}
	return null;
}

/**
 * Render a specific sprite as img 
 */
SpriteTileManager.prototype.renderSprite = function(spriteId) {
	//TODO: need to build simple graphical test to validate this.
	
	var spriteData = this.getNamedTileById(spriteId);
	if(!spriteData) {
		throw "Invalid Sprite Tile id:" +spriteId;
	}
	tileX = spriteData.col*tileMapManager.tileWidth;
	tileY = spriteData.row*tileMapManager.tileHeight;
	
	this.bufferCtx.drawImage(this.spriteImage, spriteData.xPos, spriteData.yPos, this.tileWidth, this.tileHeight, tileX,tileY, this.tileWidth, this.tileHeight);
	return this.bufferCtx.canvas;
}

/**
 * @param  tileCol, tileRow - specific col,row coordinates.
 * @return map containing x,y origin point for the requested tile.
 */
SpriteTileManager.prototype.tileOrgPoint = function(tileCol, tileRow) {
	var result = {"xPos": this.tileWidth*tileCol , "yPos": (this.tileHeight*tileRow)}
	return result;
}
/**
 * @param tile Name given when added to namedTiles
 * @return map containing x,y origin point for the requested tile.
 */
SpriteTileManager.prototype.namedTileOrgPoint = function(tileName) {
	if(typeof tileName == 'string')
		namedPt = this.getNamedTile(tileName);
	else
		namedPt = this.getNamedTileById(tileName);
	if(namedPt) {
		return this.tileOrgPoint(namedPt.col,namedPt.row);
	} else {	
		return null;
	}
}

/**
 * Retrieve a Tile reference by its name.
 */
SpriteTileManager.prototype.getNamedTile = function(tileName) {
	for(tile in this.namedTiles) {
		if(this.namedTiles[tile].name == tileName) {
			return this.namedTiles[tile];
		}
	}
	return null;
}

/**
 *  Accepts an object with tileData in the following format  
 * {"id":0,"name":"","col":0,"row":0}
 */
SpriteTileManager.prototype.addNamedTile = function(tileData) {
	return this.namedTiles[tileData.id] = tileData;
}

/**
 * Returns the retrieval data for rendering the sprite.
 */
SpriteTileManager.prototype.getNamedTileById = function(id) {
	return this.namedTiles[id];
}
/********** SpriteTileManager END **********/
