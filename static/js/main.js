

console.log('hello world');


/* global variables */
var map;
var wanderer;
var debug = false;

/* create the map */
function initMap () {
    map = new L.map('map', {
        layers: new L.TileLayer("http://a.tiles.mapbox.com/v3/" + mapbox_username + ".map-" + mapbox_map_id + "/{z}/{x}/{y}.png"),
        center: new L.LatLng(-19.003049, 22.414856),
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        touchZoom: false,
        dragging: true,
        keyboard: true,
        zoom: 16,
        minZoom: 1,                    
        maxZoom: 20
    });   

    wanderer = createWanderer(map.getCenter());
    (function aga(){
    	wanderer.wander();
    	var target = wanderer.update();
    	map.panTo(new L.LatLng(target.y,target.x), map.getZoom());
    	// map.setView(new L.LatLng(target.y,target.x));
    	// map.setView(personLatLon, map.getZoom(), {pan:{animate:false}});
    	requestAnimationFrame(aga);
    })();
}



function createWanderer(p){
	console.log(p);
	var pos = {'x':p.lng,'y':p.lat};
	var velocity = {'x':Math.random()*0.002-0.001,'y':Math.random()*0.002-0.001};
	var acceleration = {'x':Math.random()*0.002-0.001,'y':Math.random()*0.002-0.001};
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

		var aga = false;
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



/* executes on load */
$(document).ready(function() {
    initMap();
});

