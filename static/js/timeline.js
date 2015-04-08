

/*
	Interactive timeline on the map and journal page. Also handles all time related interactions.
*/


function Timeline(){

	var timeFrame = [0,new Date().getTime()];
	var node = d3.select('#timeline');
	var dayCursor = 1;
	var timeCursor = -1;
	var prevTimeCursor = -1;

	var autoSpeed = 2;
	var speed = autoSpeed;
	var tSpeed = autoSpeed;
	var wheelDelta = 0;
	var paused = false;
	var isNightTime = false;
	var nightTime = [];


	node.append('line')
		.attr('x1','50%')
		.attr('y1',0)
		.attr('x2','50%')
		.attr('y2','100%')
		.attr('stroke','#FFFFFF');

	var nightNode = d3.select('#map').append('div').attr('id','night');

	function init(day){
		for(var i=day-1; i<day+2; i+=2){
			if(i >= 0 && !loader.getLoading()[i]){
				loader.loadDay(i,function(day){
					// day = day that was just loaded
					feed.init(day);
					setTimeFrame();
				});
			}
		}
	}	


	function setTimeFrame(){
		var timestamps = [];
		for(m in loader.members){
			var member = loader.members[m];
			timestamps.push(member.getPathQueue()[0].time);
		}
		timeFrame[0] = Math.min(timeFrame[0]>0?timeFrame[0]:100000000000000,timestamps.min());
		timestamps = [];
		for(m in loader.members){
			var member = loader.members[m];
			timestamps.push(member.getPathQueue()[member.getPathQueue().length-1].time);
		}
		timeFrame[1] = Math.max(timeFrame[1],timestamps.max());
		if(timeCursor == -1){
			timeCursor = timeFrame[0];
			prevTimeCursor = timeFrame[0]-1;
			isNightTime = timeCursor >= nightTime[dayCursor][0] || prevTimeCursor < nightTime[dayCursor][1];
		}	
	}


	function update(frameRate){
		speed = Math.lerp(speed,tSpeed,0.2);
		prevTimeCursor = timeCursor;
		timeCursor += (speed*60/frameRate)*(isNightTime ? 300:1) + wheelDelta*(isNightTime ? 20:1);
		timeCursor = Math.constrain(timeCursor, timeFrame[0], timeFrame[1]);
		wheelDelta = 0;
		if(new Date(timeCursor*1000).getDate() != new Date(prevTimeCursor*1000).getDate()) newDay();
		for(var i=0; i<2; i++){
			if(timeCursor < nightTime[dayCursor][i] && prevTimeCursor >= nightTime[dayCursor][i]) toggleNightTime(i,false); 
			if(timeCursor >= nightTime[dayCursor][i] && prevTimeCursor < nightTime[dayCursor][i]) toggleNightTime(i,true); 
		}
	}

	function toggleNightTime(i,forward){
		isNightTime = (i==0 && !forward) || (i==1 && forward);
		timeCursor = nightTime[dayCursor][i] + (forward?1:-1);
		nightNode.classed('night',isNightTime);
	}


	function newDay(){
		dayCursor += timeCursor > prevTimeCursor ? 1 : -1;
		console.log('new day: ' + dayCursor);
		timeline.init(dayCursor);
	}


	function navigateMap(delta){
		tSpeed = 0;
		speed = 0;
		requestAnimationFrame(function(){
			tSpeed = paused ? 0 : autoSpeed;
		})
		wheelDelta = -delta/4;
		if(pages.active.id == 'map'){
			d3.select('#feed').node().parentNode.scrollTop += delta;
		}
	}


	function navigateJournal(t){
		tSpeed = 0;
		speed = 0;
		requestAnimationFrame(function(){
			tSpeed = paused ? 0 : 1;
		})
		wheelDelta = t-timeCursor;
		if(pages.active.id == 'map'){
			console.log('what?');
			d3.select('#feed').node().parentNode.scrollTop += delta;
		}
	}


	function getTimeCursor(){
		return {current: timeCursor, last: prevTimeCursor, day: dayCursor};
	}


	function togglePause(state){
		if(state) paused = state == 'pause';
		else paused = !paused;
		tSpeed = paused ? 0 : 1;
	}

	function setNightTime(day, interval){
		nightTime[day] = interval;
	}

	return {
		init: init,
		getTimeCursor: getTimeCursor,
		navigateMap: navigateMap,
		navigateJournal: navigateJournal,
		update: update,
		togglePause: togglePause,
		setTimeFrame: setTimeFrame,
		setNightTime: setNightTime
	};
}

