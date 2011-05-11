window.onload = windowReady;

function windowReady() {
	//console.log("Start painting");
	var CANVAS_WIDTH = 480;
	var CANVAS_HEIGHT = 320;

	//Create canvas
	var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
	var context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	
	//context.fillStyle = 'rgb(185, 0, 0)' ;
	// Create fill gradient
	var gradient = context.createLinearGradient(0,0,0,CANVAS_HEIGHT);
	gradient.addColorStop(0, '#000');
	gradient.addColorStop(1, '#fff');
	
	context.fillStyle = gradient;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	
	//darw green box.
	context.fillStyle = 'rgb(0, 255, 0)' ;
	context.fillRect(10, 20, 50, 50);	
	
	//Draw map tile onto screen
	
	img = document.createElement('img');
	img.onload = function () { 
		context.drawImage(this, 200,200);
		
		//ctx.fillStyle = ctx.createPattern(this, 'repeat'); 
		//ctx.fillRect(200, 200, canvas.width, canvas.height); 
	}; 
		
	img.src = 'res/stone1-00.gif';
	
	
//	canvas.fillRect(10, 20, 50, 50); // creates a solid square
//	canvas.strokeStyle = 'rgb(0, 182, 0)' ;
//	canvas.lineWidth = 5;
//	canvas.strokeRect(9, 19, 52, 52) ; // draws an outline
	//alert('done');
}
