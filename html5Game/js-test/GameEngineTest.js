GameEngineTest = TestCase("GameEngineTest");

GameEngineTest.prototype.testRandomFromTo = function() {
	rndVal = GameEngine.randomInt(4,6);
	assertNotNull(rndVal);
	assertTrue(rndVal>3 && rndVal <7);
};

GameEngineTest.prototype.testDiceRoll = function() {
	rndDice = GameEngine.diceRoll(2,4);
	
	assertNotNull(rndDice);
	jstestdriver.console.log("GameEngineTest", "die rol="+rndDice);
	assertTrue(rndDice >= 2 && rndDice <= 8);
	
};

/*GameEngineTest.prototype.testRandomItem = function() {
	var itemList = [1,34,56,76,9,67,5];
	result = itemList.randomItem();
	assertNotNull(result);
	match = false;
	for(il in itemList) {
		if(itemList[il] === result) match = true;
	}
	assertTrue(match);
	
};*/

GameEngineTest.prototype.testCustomEvent = function() {
	eventStatus = null;
	eventTestMsg = "EVENT_OK";
	eventTestName = "MyEvent"
	
	//create an Event 
	var myEvent = new GameEngine.CustomEvent(eventTestName);
	myEvent.subscribe(function(sender, eventArgs) {
		//alert(eventArgs.message);
		eventStatus = eventArgs.message;
	});

	myEvent.fire(null, {
		message: eventTestMsg + " " + myEvent.eventName
	});

	assertNotNull(eventStatus);
	assertEquals(eventTestMsg +" " + eventTestName, eventStatus);
}

//TODO: implement this test into the actual codebase.
/* 	1. Add to GameEngine.addMouseListener(ev)
	2. Add GameEngine.processMouseEvents() to Mouse events
	3. Build BaseObject to inherit from for Monsters to listen for clicks . how will that be done? maybe use callback on sender to notify of a match?
	4. Build UIBaseObject to listen for MouseEvent clicks as well.
	5. Consider other command related listeners
*/
/**
 * Simple test object to simulate a real obj that wants to register an eventListener
 */
function TestObject(eventName) {
	var self = this; //having a self reference allows the callback to gain access
	this.eventMessage = null;
	eventListener = function(sender, eventArgs) {
		self.setMessage(eventArgs.message);
	}
	
	this.objEvent = new GameEngine.CustomEvent(eventName);
	this.objEvent.subscribe(eventListener);
	
	this.setMessage = function(msg) {
		this.eventMessage = msg;
	}
}

/**
 * Test out how I could implement the Event usage in GE. This simulates registering an event for an object and the GE firing off the events.
 */
GameEngineTest.prototype.testCustomEvent_object = function() {
	var watchedEvents = []; //These could b set from an addEvent() function such as GameEngine.addMouseListener(ev)
	var eventName = "LEE";
	var eventTestMsg = "EVENT_OK";
	var testObj = new TestObject(eventName);
	
	watchedEvents.push(testObj.objEvent);
	
	for(e = 0 ; e < watchedEvents.length; e++) {
		watchedEvents[e].fire(null, {message: eventTestMsg + " " + watchedEvents[e].eventName});
	}
	
	assertNotNull(testObj.eventMessage);
	assertEquals(eventTestMsg +" " + eventName, testObj.eventMessage);
}

/**
 *
 */
GameEngineTest.prototype.testAddMouseEventListener = function() {
	var eventName = "LEE";
	var eventTestMsg = "EVENT_OK";
	var testObj = new TestObject(eventName);
	
	GameEngine.addMouseEventListener(testObj);
}