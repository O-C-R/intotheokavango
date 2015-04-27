

/*
	API Explorer, Genevieve's turf.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html
	UI Built out with Ractive.js: http://www.ractivejs.org/
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
	var dataPages = [
		{ nav_title: 'Overview' , view_title: 'API Overview', pageActive: true, content: "This is where we embed a few interesting endpoint visualizations" },
		{ nav_title: 'Explorer' , view_title: 'API Explorer', pageActive: false, content: "This is where we have UI elements to explore the API" },
		{ nav_title: 'Documentation' , view_title: 'API Documentation', pageActive: false, content: "This is where we have information about the API" }
	];

	/* add any other methods here */
	page.myMethod = function(){
		console.log(ractive);
	}

	var pageTemplate;
    $.ajax( '/dataPageTemplate' ).then( function ( template ) { 
		pageTemplate = template;
    });

	page.loadRactive = function() {
		console.log("loading ractive");
		var ractive = new Ractive({
	      	el: '#dataPageContainer',
	      	// We could pass in a string, but for the sake of convenience
	      	// we're passing the ID of the <script> tag above.
	      	template: '#template',
	      	// delimiters: [ '{[{', '}]}' ],
	      	// Here, we're passing in some initial data
	      	data: { 
	      		pages : dataPages 	
	      	}
		});

		ractive.on('activateDoc', function() {
			ractive.set('pages[2].pageActive', true);
			ractive.set('pages[1].pageActive', false);
			ractive.set('pages[0].pageActive', false);
			console.log('Activate Documentation Page');
		});

		ractive.on('activateExp', function() {
			ractive.set('pages[1].pageActive', true);
			ractive.set('pages[2].pageActive', false);
			ractive.set('pages[0].pageActive', false);
			console.log('Activate Explorer Page');
		});
		
		ractive.on('activateOver', function() {
			ractive.set('pages[0].pageActive', true);
			ractive.set('pages[2].pageActive', false);
			ractive.set('pages[1].pageActive', false);
			console.log('Activate Overview Page');
		});

	}

	page.loadRactive();

	return page;
}

