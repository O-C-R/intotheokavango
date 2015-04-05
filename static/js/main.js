

console.log('aga');

/* global variables */
var map;
var wanderer;
var debug = false;
var frameCount = 0;

var mapbox_username = "brianhouse"; //"blprnt";
var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";

var pages = {};

/* create the map */
function init() {
    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/' + mapbox_username + '.map-' + mapbox_map_id + '/{z}/{x}/{y}.png'),
        zoomControl: false,
        center:new L.LatLng(-19.003049, 22.414856),
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        minZoom: 1,                    
        maxZoom: 20,
        zoom:16
    });   

    wanderer = createWanderer(map.getCenter());

    (function animate(){
    	frameCount ++;
    	wanderer.wander();
    	var target = wanderer.update();
    	map.panTo(new L.LatLng(target.y,target.x), {animate:false});
    	requestAnimationFrame(animate);
    })();

    pages.about = createPage('about');
    // pages.about.show();
    pages.map = createMapPage('map');
    pages.map.show();
    pages.journal = createJournalPage('journal');
    pages.data = createPage('data');
    pages.share = createPage('share');

    d3.selectAll('#navigation li')
    	.on('click',function(){
    		var btn = d3.select(this);
    		var t = btn.text().toLowerCase();
    		pages.active.hide();
    		pages[t].show();
    	})

	window.addEventListener('resize',resize);

	function resize(){

		var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
		var headerHeight = d3.select('#header').node().clientHeight;
		var height = containerHeight - headerHeight;

		d3.select('#mapPage')
			.style('height',height+'px');

		d3.select('#timeline')
			.style('height',(height-70)+'px');
	}
	resize();
}



function createMapPage(){
	var page = createPage('map');

	page.show = function(){
		page.element.classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
	}

	return page;
}

function createJournalPage(){
	var page = createPage('map');
	page.id = 'journal';
	page.button = d3.select('#navigation li.' + page.id);

	page.show = function(){
		page.element.classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
	}

	page.hide = function(){
		page.element.classed('hidden',true);
		page.button.classed('active',false);
	}

	return page;
}

function createPage(i){

	var id = i;
	var button = d3.select('#navigation li.' + i);
	var element = d3.select('#'+ id + 'Page');

	function show(){
		element.classed('hidden',false);
		button.classed('active',true);
		pages.active = this;
		offsetHeader(id=='about');
	}

	function hide(){
		element.classed('hidden',true);
		button.classed('active',false);
	}

	function offsetHeader(isAbout){
		var header = d3.select('#header');
		if(!isAbout){
			header.style('width','97.2%')
				.style('padding-right','1.4%');
		} else {
			var containerWidth = header.node().clientWidth;
			header.style('width',(97.2 + (15/d3.select('body').node().clientWidth)*100) + '%')
				.style('padding-right',0);

			console.log((97.2 + (14/d3.select('body').node().clientWidth)*100) + '%');
		}
	}

	return{
		id: id,
		button: button,
		element: element,
		show: show,
		hide: hide,
		offsetHeader: offsetHeader
	}
}







function createWanderer(p){
	console.log(p);
	var pos = {'x':p.lng,'y':p.lat};
	var velocity = {'x':Math.random()*0.002-0.001,'y':Math.random()*0.002-0.001};
	var acceleration = {'x':0,'y':0};
	var r = 0.0003;  // ?
	var wanderTheta = 0;
	// var maxSpeed = 2;
	// var maxForce = 0.05;
	var maxSpeed = 0.000005;
	var maxForce = 0.000000125;


	if(debug){
		var svg = d3.select('#beaconContainer')
	    	.append('svg')
	    	.classed('wanderer',true)

	    svg.append('circle')
	    	.attr('stroke','rgb(255,0,0)')
	    	.attr('fill','none')
	    	.attr('cx',150)
	    	.attr('cy',150)
	    	.attr('r',20)

	    svg.append('rect')
	    	.attr('stroke','rgb(255,0,0)')
	    	.attr('fill','none')
	    	.attr('x',145)
	    	.attr('y',145)
	    	.attr('width',10)
	    	.attr('height',10)

	    svg.append('line')
	    	.attr('stroke','rgb(255,0,0)')
	    	.classed('origin',true)

	    svg.append('line')
	    	.attr('stroke','rgb(255,0,0)')
	    	.classed('target',true)
    }

	function update(){

		// console.log('u1', pos.x, pos.y, velocity.x, velocity.y);
		velocity.x += acceleration.x;
		velocity.y += acceleration.y;
		velocity.x = Math.min(velocity.x, maxSpeed);
		velocity.y = Math.min(velocity.y, maxSpeed);
		pos.x += velocity.x;
		pos.y += velocity.y;
		acceleration.x = 0;
		acceleration.y = 0;

		// console.log('u2', pos.x, pos.y, velocity.x, velocity.y);

		return pos;
	}

	function wander(){

		var wanderR = 0.000018;
		var wanderD = 0.004;
		var change = 0.3;
		wanderTheta += Math.random()*(change*2)-change;
		// console.log(Math.round(wanderTheta*100));
		
		var circlePos = {'x':velocity.x,'y':velocity.y};
		var t = Math.atan2(circlePos.y,circlePos.x);

		circlePos.x = wanderD * Math.cos(t) + pos.x;
		circlePos.y = wanderD * Math.sin(t) + pos.y;

		var t = Math.atan2(velocity.y,velocity.x);
	    var circleOffset = {'x': wanderR*Math.cos(wanderTheta+t), 'y': wanderR*Math.sin(wanderTheta+t)};
	    var target = {'x': circlePos.x + circleOffset.x, 'y': circlePos.y + circleOffset.y}
	    seek(target);

	    if(debug){
		    svg.select('circle')
		    	.attr('cx',150+(circlePos.x - pos.x)*10000)
		    	.attr('cy',150+(-circlePos.y + pos.y)*10000)

		    svg.select('line.target')
		    	.attr('x1',150+(circlePos.x - pos.x)*10000)
		    	.attr('y1',150+(-circlePos.y + pos.y)*10000)
		    	.attr('x2',150+(circlePos.x - pos.x)*10000 + Math.cos(wanderTheta)*20)
		    	.attr('y2',150+(-circlePos.y + pos.y)*10000 - Math.sin(wanderTheta)*20)
	    }

	}

	function applyForce(force){
		acceleration.x += force.x;
		acceleration.y += force.y;
	}

	function seek(target){
		var desired = {'x':target.x-pos.x,'y':target.y-pos.y};
		var t = Math.atan2(desired.y,desired.x);
	    desired.x = maxSpeed * Math.cos(t);
		desired.y = maxSpeed * Math.sin(t);

		var steer = {'x':desired.x-velocity.x,'y':desired.y-velocity.y};
		var r = Math.sqrt(steer.x*steer.x+steer.y*steer.y);
		r = Math.min(r,maxForce);
		applyForce(steer);
	}
 
	return {
		'update': update,
		'wander': wander,
		'applyForce': applyForce,
		'seek': seek
	};
}

document.addEventListener('DOMContentLoaded', init);

