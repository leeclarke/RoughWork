//Testing Util

	
	function report(testName, response) {
		var out = $('<ul>');
		out.html("<li><b>"+ testName +"</b></span>: [ " + response + " ]</li>");
		out.appendTo('body');
	}
		
	/**
	 * Tests Object equality.
	 */
	function assertEquals(expected, actual) {	
		if(actual) {
			if(typeof expected != typeof actual)	{
				return false;					
			} 
			else {//compare values 
			//TODO: need to check for objects/ and debug
				for (var key in expected) {
					if(expected[key] != actual[key])
						return false;
				}
				return true;
			}
		}
		return false;
	}
	
	/**
	 * REturn from Tests to ensure consistant output
	 */
	function evalTest(info, resp) {
		return (info +" "+ ((resp)?"Success":"Failed")); 
	}
