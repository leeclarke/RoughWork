

//TODO: 2. Add line of sight checking for creatures.
//TODO: Put together Groovy script that builds a JS deployment.
//TODO: seperate todo list into a real todo and add a sh script so I can manage todos properly!
//TODO: Build map maker
//		Hold on ties til know requirements
//TODO: Work out implelemntation of MapTile and the expected datatypes. It would save processing time to set the height/width etc at creation.
//TODO: figure out creature rendering.

//TODO: Work out getting a message back to gui.. like when a door is locked.

//TODO: look into new requestAnimationFrame() function which makes animation safer and accurate.
//TODO: SoundManager is best at the moment for sounds but audioApi is better once avail. check into IO session.
//TODO: DESIGN: When building a level editor it might be more efficent for it to save the level map as an image if the level isnt 
//      dynamicly built.Would it work for the maps to be built on the back end by Node.js if they are generated?
//TODO: need to come up with image loader to detect when images are loaded and start rendering. display loading.. thing.

var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 600;
var showGrid = true;
var player;
var theMap;
var context;
var manager = new EntityManager();
var monsters =[];

/**
 * WindowReady used for starting up the game prototype.
 *
 * This simulates an actual game client
 */
function windowReady() {
	//Create canvas
	var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
	context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	//Set up background.
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	
	tileWidth = 32;
	tileHeight = 32;
	tiledMap = new TiledMap(CANVAS_WIDTH+300,CANVAS_HEIGHT+300,tileWidth,tileHeight);

	//add fake player sprite, centerd in middle of screen
	player = manager.createEntity('Player');
	player.x = 128;
	player.y = 64;
	player.name = "Lee";
	player.spriteImg.src = "res/player.png";
	 
	
	//Test Monster
	dragon = manager.createCreature('Green Dragon');
	dragon.x = 12*32;
	dragon.y = 8*32;
	dragon.name = "Green Dragon";
	dragon.spriteImg.src = "res/dragon.png";
	dragon.agression = 7; //yikes!
	dragon.range = 5;
	
	monsters.push(dragon);
	
	
	dragon2 = manager.createCreature('Green Dragon');
	dragon2.x = 3*32;
	dragon2.y = 4*32;
	dragon2.name = "Green Dragon2";
	dragon2.spriteImg.src = "res/dragon.png";
	dragon2.agression = 2;
	dragon2.range = 4;
	
	monsters.push(dragon2);

	testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]};
	
	tileMapManager = new SpriteTileManager(testManagerConfig);

	//TODO: Why is there an id and type and both set to the same number? ID should be unique id and type == tp tile id.
	mapTiles = [
				[{},{}],
				[{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{"id":1, "type":1},{"id":2, "type":2},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],				
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],		
				[{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}]
		];
	tiledMap.updateMap(mapTiles);
	tiledMap.tileMapManager = tileMapManager;
	
	theMap = tiledMap.renderMap();
	//draw to canvas	
	render();
}

window.onload = windowReady;

/**
 * Draws the status display overlay. 
 */
function buildStatusDisplay(context) {
	//position in upper left corner
	statWidth = 150;
	
	context.save();
	context.translate(0,0);
	
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	context.lineWidth = "0.5";
	
	//drawFrame
	context.strokeRect(5,5,(statWidth-10),CANVAS_HEIGHT-10);
	context.fillStyle = "rgba(204, 204, 204, 0.1)";
	context.fillRect(6,6,(statWidth-12),CANVAS_HEIGHT-12);
	
	//Write some text for Debugging
	context.fillStyle = "#FFFF33"; // Set color to black
	context.fillText("Player", 8, 20);
	context.fillText("x:"+player.x+" y:"+player.y, 8, 40);
	
	context.restore();
}

/**
 * Responsable for rendering the ViewPort or Camera of the game.
 */
function render() {
	vpX = (CANVAS_WIDTH/2)-(tileWidth/2); //viewPort Center.
	vpY = (CANVAS_HEIGHT/2)-(tileHeight/2);
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT ) ;
	renderViewPort(context, theMap, player, vpX,vpY); 
}

//TODO: REMOVE this is for testing only,  with out running a game loop.  add key_status.js to html page for actual support.
$(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
    fakeLoop();
  });
  
  $(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
    fakeLoop(); //Forcing an update outside of thread loop
  });
});

function fakeLoop() {
	update();
	render();
}
//REMOVE: TESTING only


/**
 * Update player postion based on input.
 */
function update() {
	mover = new Mover();
  if (keydown.left) {
    mover.movePlayer(player, -32,0);
    moveMonsters();
  }

  if (keydown.right) {
    mover.movePlayer(player, 32,0);
    moveMonsters();
  }
  
  if (keydown.up) {
      mover.movePlayer(player, 0,-32);
      moveMonsters();
  }
  
  if (keydown.down) {
        mover.movePlayer(player, 0,32);
        moveMonsters();
  }
  
  //TODO: have monsters scan for player
  
}

function moveMonsters() {
	mover = new Mover();
	for(m in this.monsters) {
		mover.moveMonster(this.monsters[m],player);
	}	
}

/**
 * Paints the game map then centers the viewport on the player sprite.
 *
 * @param contest - ViewPort's 2D context
 * @param palyer  - Player object which contains players map location.
 * @param vpCtrX - ViewPort's center X position, adjusted to the UL corner of the center player tile.
 * @param vpCtrY - ViewPort's center Y position, adjusted to the UL corner of the center player tile.
 */
function renderViewPort(context, theMap, player, vpCtrX, vpCtrY) {
	context.save();  //save position to return to later.
	context.translate(vpCtrX-player.x,vpCtrY-player.y); //Move to point on map where player stands
	context.drawImage(theMap, 0, 0);

	//Draw monsters
	for(m in monsters){
		context.drawImage(monsters[m].renderImg(), monsters[m].x, monsters[m].y);
	}

	if(showGrid) {
		paintGrid(context, theMap.width, theMap.height);
	}
	context.restore(); //pop the canvas back to where it was which moves the map.
	buildStatusDisplay(context);
	context.drawImage(player.renderImg(), vpX, vpY); //Draws player sprite in the middle of VP
}


