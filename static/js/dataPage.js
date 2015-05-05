

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
	var ractive;

	/* add any other variables here */
	var foo = 'bar';
	var dataPages = [
		{ nav_title: 'Overview' , view_title: 'API Overview', pageActive: true, content: "This is where we embed a few interesting endpoint visualizations" },
		{ nav_title: 'Explorer' , view_title: 'API Explorer', pageActive: false, content: "This is where we have UI elements to explore the API" },
		{ nav_title: 'Documentation' , view_title: 'API Documentation', pageActive: false, content: "This is where we have information about the API" }
	];

	var features = ["ambit","ambit_geo","audio","beacon","image","sensor",'sighting','tweet'];
	var featureTitles = ["Ambit Readings", "Ambit-Geo Readings", "Audio Recordings", "Beacon Readings", "Images", "Sensor Readings", "Sightings", "Tweets"];
	var index = 0;  
	var featuresCountArray = [];

	var featureTotals = [
			{ featureType : "ambit", total: 13000, title: "Ambit Readings" }, 
			{ featureType : "ambit_geo", total: 2111, title: "Ambit-Geo Readings" }, 
			{ featureType : "audio", total: 57, title: "Audio Recordings" }, 
			{ featureType : "beacon", total: 141, title: "Beacon Readings" }, 
			{ featureType : "image", total: 842, title: "Images" }, 
			{ featureType : "sensor", total: 1931, title: "Sensor Readings" }, 
			{ featureType : "sighting", total: 413, title: "Sightings" }, 
			{ featureType : "tweet", total: 264, title: "Tweets" }, 
		];

	var FeaturesWidget;

	/* add any other methods here */
	page.myMethod = function(){
		console.log(ractive);
	}

	page.getFeatureTotalData = function(featureType) {
        var url = "http://dev.intotheokavango.org/api/features?FeatureType=" + featureType + "";
       
        d3.json(url, function(error, data) {
            console.log(featureType + " data");
            
            var featuresCountObj = {};
            featuresCountObj.featureType = featureType;
            featuresCountObj.total = data.total;
            featuresCountObj.title = featureTitles[index];
            featuresCountArray.push(featuresCountObj);

            console.log("index: " + index);
            console.log(ractive.get("featuresArray[" + index + "].total"));
            console.log(ractive.findComponent('features'));
            ractive.set("featuresArray[" + index + "].total", featuresCountObj.total);
            
            if(index < features.length -1){
                index++;
                setTimeout(page.getFeatureTotalData(features[index], ractive, 100));
            }
            else {
                console.log("featuresCountArray");
                console.log(featuresCountArray);
                console.log("featuresArray at index: " + index);
                console.log(ractive.get("featuresArray"));
                return featuresCountArray;
            }
        });
	}

	var pageTemplate;// = "<H1>{{view_title}}</H1>";
	var featuresTemplate;

	page.getDataPageTemplate = function() {
		$.ajax( 'static/templates/dataPageTemplate.hbs' ).then( function ( template ) { 
			pageTemplate = template;
			console.log(pageTemplate);
			//load main Ractive template
			page.loadRactive(template);
			//load other templates
			getFeaturesTemplate();
	    });
    }

    getFeaturesTemplate = function() {
    	$.ajax( 'static/templates/featuresTemplate.hbs' ).then( function (template) {
	    	featuresTemplate = template;
	    	console.log(featuresTemplate);
	    	return featuresTemplate;
	    	/* this works but creates a new Ractive instance
	    	var ractive_features = new Ractive({
	    		el: "#features-totals",
				template: featuresTemplate,
				//oninit: getFeatureTotalData(features[index]),
				data: { featuresArray : featureTotals }
			});

			page.getFeatureTotalData(features[index], ractive_features);
			*/

        });
	}

    var FeaturesWidget = Ractive.extend({
    	template: '<div id="features-left">{{ >totals}}</div><div id="features-right">{{ >featureTypes}}</div>{{#partial featureTypes}}{{#each featuresArray}}<ul><li>{{ title }}</li></ul>{{/each}}{{/partial}}{{#partial totals}}{{#each featuresArray}}<ul><li>{{ total }}</li></ul>{{/each}}{{message}}{{/partial}}',
    	// data: function() {
    	// 	return { featuresArray : featureTotals }
    	oninit: page.getFeatureTotalData(features[index]), //isn't able to update the data yet
    	data: function() {
    		return {
    		featuresArray : featureTotals
    		};
    	}
    });

	Ractive.components.features = FeaturesWidget;

	page.loadRactive = function(template) {
		console.log("loading ractive");
		ractive = new Ractive({
	      	el: '#dataPageContainer',
	      	// We could pass in a string, but for the sake of convenience
	      	// we're passing the ID of the <script> tag above.
	      	// template: '#navTemplate',
	      	template: template,
	      	// delimiters: [ '{[{', '}]}' ], //dont' need delimiters if using {% raw %} and {% endraw %}
	      	// Here, we're passing in some initial data
	      	data: { 
				pages : dataPages 	
			}
		});

		ractive.on('activateDoc', function() {
			ractive.set('pages[2].pageActive', true);
			ractive.set('pages[1].pageActive', false);
			ractive.set('pages[0].pageActive', false);
			$('#features-area').hide();
			console.log('Activate Documentation Page');
		});

		ractive.on('activateExp', function() {
			ractive.set('pages[1].pageActive', true);
			ractive.set('pages[2].pageActive', false);
			ractive.set('pages[0].pageActive', false);
			$('#features-area').show();
			console.log('Activate Explorer Page');
		});
		
		ractive.on('activateOver', function() {
			ractive.set('pages[0].pageActive', true);
			ractive.set('pages[2].pageActive', false);
			ractive.set('pages[1].pageActive', false);
			$('#features-area').hide();
			console.log('Activate Overview Page');
		});

		
		window.ra = ractive;

	}

	page.getDataPageTemplate();
	//page.getFeaturesTemplate();

	return page;
}

