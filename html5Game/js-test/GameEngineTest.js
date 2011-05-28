GameUtilsTest = TestCase("GameUtilsTest");

GameUtilsTest.prototype.testRandomFromTo = function() {
	rndVal = Math.randomInt(4,6);
	assertNotNull(rndVal);
	assertTrue(rndVal>3 && rndVal <7);
}

GameUtilsTest.prototype.testDiceRoll = function() {
	rndDice = Math.diceRoll(2,4);
	
	assertNotNull(rndDice);
	jstestdriver.console.log("GameUtilsTest", "die rol="+rndDice);
	assertTrue(rndDice >= 2 && rndDice <= 8);
	
}

GameUtilsTest.prototype.testRandomItem = function() {
	//assertTrue('Array doesnt have randomItem method', Array.hasOwnProperty('ramdomItem'));
	Math();
	itemList = [1,34,56,76,9,67,5];
	result = itemList.randomItem();
	assertNotNull(result);
	match = false;
	for(il in itemList) {
		if(itemList[il] === result) match = true;
	}
	assertTrue(match);
	
}

GameUtilsTest.prototype.testIndexOf = function() {
	itemList = [1,34,56,76,9,67,5];
	result = itemList.indexOf(76);
	assertNotNull(result);
	assertEquals(3,result);
	
}
