/**
 * Just utils for rendering to the canvas
 * //TODO might consider moving this to GameEngine.
 */

function paintGrid(context, mapWidth, mapHeight) {
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	
	context.lineWidth = "0.5";
	gridWidth = ~~(mapWidth/GameEngine.currentMap.getTileWidth());
	gridHeight = ~~(mapHeight/GameEngine.currentMap.getTileHeight());
	
	//drawFrame
	context.strokeRect(0,0,mapWidth,mapHeight);
	
	context.lineWidth = "0.25";
	//drawVert
	for(x = 0; x<= gridWidth; x++) {
		xPos = GameEngine.currentMap.getTileWidth()*x;
		drawLine(context,xPos,0,xPos,mapHeight);
		context.fillRect(xPos,2, 2, 2) ;
	}
	
	//drawHorz
	for(y = 0; y<= gridWidth; y++) {
		yPos = GameEngine.currentMap.getTileHeight()*y;
		drawLine(context,0,yPos,mapWidth,yPos);
		context.fillRect(xPos,2, 2, 2) ;
	}
}

/**
 * Line Drawing Helper
 */
function drawLine(contextO, startx, starty, endx, endy) {
  contextO.beginPath();
  contextO.moveTo(startx, starty);
  contextO.lineTo(endx, endy);
  contextO.closePath();
  contextO.stroke();
}
