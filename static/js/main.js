

/*


	Okavango 2015 front-end.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html

	API NEEDS :
	- Should we use Jer's or Brian's mapbox credentials? Should they be hidden?

	TODO IAN: 
	- handle multiple days / multiple timeline segments
	- handle night time
	- handle group split
	- time control button
	- add preloader graphics
	- add location to post meta + link
	- add lerp to map and member markers
	- unzoom on journal?
	- make all post type to inherit from super class
	- try without smooth scroll
	- localstorage?
	- API error handling
	- layout transitions
	- replace data loading with promises
	- minify and merge for production


*/


// These should eventually be moved into the closure.


document.addEventListener('DOMContentLoaded', function(){


	var debug = false;
	var frameCount = 0;

	var mapbox_username = "brianhouse"; //"blprnt";
	var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";

	var loader;
	var pages = {};
	var map;
	var timeline;
	var feed;
	var wanderer;



    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/' + mapbox_username + '.map-' + mapbox_map_id + '/{z}/{x}/{y}.png'),
        zoomControl: false,
        center:new L.LatLng(-19.003049,22.414856),
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        minZoom: 1,                    
        maxZoom: 20,
        zoom:17
    });   

    loader = Loader();
    pages.about = Page('about');
    pages.map = MapPage('map');    
    pages.journal = JournalPage('journal');
    pages.data = DataPage('data');
    pages.share = Page('share');
    wanderer = Wanderer(map.getCenter());
    timeline = Timeline();
	feed = Feed();

	pages.map.show();
	setLayoutInteractions();
	loader.loadDay(0,function(day){
		feed.init(day);
		timeline.init(day);
		animate(new Date().getTime()-16);
	});


	function animate(lastFrameTime){
		var frameTime = new Date().getTime();
		var frameRate = 1000/(frameTime - lastFrameTime);
	    frameCount ++;
	    if(pages.active.id == 'map' || pages.active.id == 'journal'){
		    timeline.update(frameRate);
		    var coord = [0,0];
			for(m in loader.members){
				var member = loader.members[m];
				member.move(timeline.getTimeCursor());
				var c = member.getLatLng();
				coord[0] += c.lat;
				coord[1] += c.lng;
			}
			coord[0] /= Object.keys(loader.members).length;
			coord[1] /= Object.keys(loader.members).length;
			map.panTo(new L.LatLng(coord[0],coord[1]), {animate:false});
		} else {
			wanderer.wander();
	    	var target = wanderer.update();
	    	map.panTo(new L.LatLng(target.y,target.x), {animate:false});
		}

		requestAnimationFrame(function(){animate(frameTime)});
	}


	function setLayoutInteractions(){	
		d3.selectAll('#navigation li')
	    	.on('click',function(){
	    		var btn = d3.select(this);
	    		var t = btn.text().toLowerCase();
	    		pages.active.hide();
	    		pages[t].show();
	    	})

		d3.select('#contentContainer')
	    	.on('mousewheel',function(){
	    		if(pages.active.id == 'map') timeline.navigateMap(d3.event.wheelDeltaY);
	    	})

	    d3.select('#mapPage')
	    	.on('click',function(){
	    		if(pages.active.id == 'map') timeline.togglePause();
	    	})
		
		window.addEventListener('resize',resize);
		resize();	
	}


	function resize(){
		var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
		var headerHeight = d3.select('#header').node().clientHeight;
		var height = containerHeight - headerHeight;

		d3.select('#mapPage')
			.style('height',height+'px');

		d3.select('#timeline')
			.style('height',(height-70)+'px');
	}
});




