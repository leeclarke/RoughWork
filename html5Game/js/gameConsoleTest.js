var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 600;

//Set Static Values on the GameEngine
GameEngine.CANVAS_WIDTH = 1000;
GameEngine.CANVAS_HEIGHT = 600;
GameEngine.STATUS_WIDTH = 80;
GameEngine.DisplayGrid = true;
GameEngine.lightsOn = false;
GameEngine.lastUpdate = Date.now();
var context;

/**
 * WindowReady used for starting up the game prototype.
 *
 * This simulates an actual game client
 */
function windowReady() {
	Math.floor(1);  //force this to add the added on methods. TODO: change methods to GameEngine object.
	//Create canvas
	var canvasElement = $("<canvas width='" + GameEngine.CANVAS_WIDTH + 
                      "' height='" + GameEngine.CANVAS_HEIGHT + "'></canvas>");
	context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	//Set up background.
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT ) ;
	
	tiledMap = new TiledMap(GameEngine.CANVAS_WIDTH+300,GameEngine.CANVAS_HEIGHT+300,32,32);

	//add fake player sprite, centerd in middle of screen
	GameEngine.player = EntityManager.createEntity('Player');
	GameEngine.player.x = (3*32);
	GameEngine.player.y = (11*32);
	GameEngine.player.name = "Lee";
	GameEngine.player.spriteImg.src = "res/player.png";
	GameEngine.player.deadImg.src = "res/bones.png";
	GameEngine.player.weaponWielded = EntityManager.weaponFactory('Sword');
	 
	
	//Test Monster
	dragon = EntityManager.createCreature('Green Dragon');
	dragon.x = 12*32;
	dragon.y = 8*32;
	dragon.name = "Green Dragon";
	dragon.spriteImg.src = "res/dragon.png";
	dragon.deadImg.src = "res/bones.png";
	dragon.agression = 7; //yikes!
	dragon.range = 5;
	dragon.hp = 8;
 	dragon.hpMax = 8;
	
	GameEngine.monsters.push(dragon);
	
	
	dragon2 = EntityManager.createCreature('Green Dragon');
	dragon2.x = 3*32;
	dragon2.y = 4*32;
	dragon2.name = "Green Dragon2";
	dragon2.spriteImg.src = "res/dragon.png";
	dragon2.deadImg.src = "res/bones.png";
	dragon2.agression = 2;
	dragon2.range = 4;
	dragon2.hp = 8;
 	dragon2.hpMax = 8;
	
	GameEngine.monsters.push(dragon2);

	testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]};
	
	tileMapManager = new SpriteTileManager(testManagerConfig);

	//'id' is the sprite id and type is the 
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
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],				
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],		
				[{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}]
		];
	tiledMap.tileMapManager = tileMapManager;
	tiledMap.updateMap(mapTiles);
		
	GameEngine.currentMap = tiledMap;
	
	//draw to canvas		
	GameEngine.render();
	setInterval(main, 1);
}

window.addEventListener("mousedown", function(e) {
  // A mouse click means the players wants to attack.
  // We don't actually do that yet, but instead tell the rest
  // of the program about the request.
  GameEngine.addEventMessage(("Mouse Event [ button="+e.button+" pageX=" + e.pageX + " pageY=" + e.pageY));
  GameEngine.mouseClick = e;
}, false);

function handleInput() {
  // Here is where we respond to the click
  if(GameEngine.mouseClick != null){
    //e.button, e.pageX, e.pageY
    GameEngine.mouseClick = null;
  }
};

function main () {
	// Calculate elapsed time since last frame
	var now = Date.now();
	GameEngine.elapsed = (now - this.lastUpdate);
	GameEngine.lastUpdate = now;
	
	handleInput();
	update();
	GameEngine.render();
};


window.onload = windowReady;


//TODO: REMOVE this is for testing only,  with out running a game loop.  add key_status.js to html page for actual support.
$(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
    //fakeLoop();
  });
  
  /*$(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
    //fakeLoop(); //Forcing an update outside of thread loop
  });*/
});

function fakeLoop() {
	update();
	GameEngine.render();
}
//REMOVE: TESTING only

/**
 * Update player and Monster postion based on input.
 */
function update() {
	mover = new Mover();
  if (keydown.left) {
	keydown.left = false;
	mover.movePlayer(GameEngine.player, -32,0);
	GameEngine.moveMonsters();
  }

  if (keydown.right) {
	keydown.right = false;
	mover.movePlayer(GameEngine.player, 32,0);
	GameEngine.moveMonsters();
  }
  
  if (keydown.up) {
	keydown.up = false;
	mover.movePlayer(GameEngine.player, 0,-32);
	GameEngine.moveMonsters();
  }
  
  if (keydown.down) {
	keydown.down = false;
	mover.movePlayer(GameEngine.player, 0,32);
	GameEngine.moveMonsters();
  }
  
  if (keydown.f2) {
	keydown.f2 = false;
	//toggle display stats bar
	GameEngine.showPlayerStatus = (GameEngine.showPlayerStatus)?false:true;
  }
}








