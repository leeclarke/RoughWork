/**
 * Just utils for rendering to the canvas
 */

function paintGrid(context, mapWidth, mapHeight) {
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	
	context.lineWidth = "0.5";
	gridWidth = ~~(mapWidth/tileWidth);
	gridHeight = ~~(mapHeight/tileHeight);
	
	//drawFrame
	context.strokeRect(0,0,mapWidth,mapHeight);
	
	context.lineWidth = "0.25";
	//drawVert
	for(x = 0; x<= gridWidth; x++) {
		xPos = tileWidth*x;
		drawLine(context,xPos,0,xPos,mapHeight);
		context.fillRect(xPos,2, 2, 2) ;
	}
	
	//drawHorz
	for(y = 0; y<= gridWidth; y++) {
		yPos = tileHeight*y;
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
