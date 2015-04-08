

/*
	Describes members' markers on the map
*/


function Member(n, l, d){

	var name = n;
	var pathQueueByDay = [];
	var pathQueue = [];
	var timeCursor = 0;
	var dayCursor = d;
	var latLng = l;
	var icon = L.divIcon({className: 'memberMarker', html: '<p>' + name + '</p>', iconSize:['auto','auto']});
	var marker = L.marker(latLng, {icon: icon}).addTo(map);


	function addAmbitGeo(d, l, t){
		if(!pathQueueByDay[d]) pathQueueByDay[d] = [];
	    pathQueueByDay[d].push({latLng:l, time:t});
	}


	function move(time){
		if(!time) return;
		var forward = time.current >= time.last;
		var fw = forward ? 1:-1;
		time = time.current;
		var interval = [];
		var len = pathQueue.length;


		if(timeCursor > -1){
			for(var i = Math.constrain(timeCursor-fw,0,len-1); forward?(i<len-1):(i>0); i+=fw){
				if(time >= pathQueue[i + (forward?0:-1)].time && time < pathQueue[i + (forward?1:0)].time){
					interval = [pathQueue[i + (forward?0:-1)], pathQueue[i + (forward?1:0)]];
					timeCursor = i;
					break;
				}
			}
		} else {
			for(var i = 1; i<len-1; i++){
				if(time >= pathQueue[i + (forward?0:-1)].time && time < pathQueue[i + (forward?1:0)].time){
					interval = [pathQueue[i + (forward?0:-1)], pathQueue[i + (forward?1:0)]];
					timeCursor = i;
					break;
				}
			}
		}


		if(interval.length == 2){
			var lat = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lat, interval[1].latLng.lat);
			var lng = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lng, interval[1].latLng.lng);
			latLng = new L.LatLng(lat,lng);
			marker.setLatLng(latLng);
		} else {
			// console.log('could not find path: ' + name);
		}

	}


	function getLatLng(){
		return latLng;
	}

	function getPathQueue(){
		return pathQueue;
	}

	function getPathQueueByDay(i){
		return pathQueueByDay[i];
	}

	function initPathQueue(){
		pathQueue = [];
	    var len = pathQueueByDay.length;
	    for(var i=0; i<len; i++){
	    	if(pathQueueByDay[i]){
	    		if(i >= 1 && pathQueueByDay[i-1]) pathQueueByDay[i][0].latLng = pathQueueByDay[i-1][pathQueueByDay[i-1].length-1].latLng;
		    	if(pathQueue.length == 0) pathQueue = pathQueueByDay[i];
		    	else pathQueue = pathQueue.concat(pathQueueByDay[i]);
		    }
	    }
	    timeCursor = -1;
	}


	return{
		addAmbitGeo: addAmbitGeo,
		getLatLng: getLatLng,
		name: name,
		marker: marker,
		move: move,
		getPathQueue: getPathQueue,
		getPathQueueByDay: getPathQueueByDay,
		timeCursor: timeCursor,
		initPathQueue: initPathQueue
	}
}

