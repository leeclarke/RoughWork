/**
 * Generate rnd number between 2 numbers including the from and to values.
 */
Math.randomInt = function(from, to) {
   return Math.floor(Math.random() * (to - from + 1) + from);
};

/**
 * Random number gen that simulates dice rolls just for simple understanding..
 */
Math.diceRoll = function( sides, numDice) {
	return Math.randomInt(sides, sides*numDice);       
};

/**
 * Select random item from an Array.
 */
Array.prototype.ramdomItem =  function(){	
	return this[Math.randomInt(0, this.length - 1)];
};

/**
 * Find an object location in an Array.
 */
Array.prototype.indexOf = function (vItem) {
    for (var i=0; i < this.length; i++) {
        if (vItem == this[i]) {
            return i;
        }    }
    return -1;
}
