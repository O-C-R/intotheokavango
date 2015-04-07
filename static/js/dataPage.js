

/*
	API Explorer, Genevieve's turf.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html
*/


function DataPage(id){


	/* 	Extends Page in layout.js
		Which among others gives you access to the following methods:
		- page.getNode()
		- page.show()
		- page.hide()	*/
	var page = Page(id);


	/* add any other variables here */
	var foo = 'bar';


	/* add any other methods here */
	page.myMethod = function(){
		console.log(foo);
	}


	return page;
}

