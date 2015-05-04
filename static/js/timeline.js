

/*
	Interactive timeline on the map and journal page. Also handles all time related interactions.
*/


function Timeline(){

	var timeFrame = [0,new Date().getTime()];
	var totalTimeFrame = [0,new Date().getTime()];
	var node = d3.select('#timeline');
	var height;
	var controlNode = d3.select('div.controls div.control-playback');
	var lastControlState = 'Pause';
	var dayCursor = 0;
	var timeCursor = -1;
	var prevTimeCursor = -1;

	var autoSpeed = 2;
	var speed = autoSpeed;
	var tSpeed = autoSpeed;
	var wheelDelta = 0;
	var paused = false;
	var isNightTime = false;
	var nightTime = [];

	var dayCount = 16;
	var graphicsInitialized = false;
	var dates = [];
	var dayRad = 2.5;
	var margin = 10;
	var cursor;


	node.append('line')
		.attr('x1','80%')
		.attr('y1',margin)
		.attr('x2','80%')
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
		initGraphics();
	}	

	function initGraphics(){

		if(!graphicsInitialized){
			dates = [];
			var t = loader.members['Steve'].getPathQueue()[0].time*1000;
			totalTimeFrame[0] = t;
			for(var i=0; i<=dayCount; i++){
				// WHY +1 ?
				var d = new Date(t+(24*3600*1000*(i+1)));
				// d.setHours(0);
				// d.setMinutes(0);
				// d.setSeconds(0);
				// d.setMilliseconds(0);
				dates.push(d);
				totalTimeFrame[1] = t+(24*3600*1000*(i+1));
			}

			console.log(dates);

			node.selectAll('circle.day')
				.data(dates)
				.enter()
				.append('circle')
				.attr('class','day')
				.attr('cx','80%')
				.attr('r',dayRad)
				.attr('fill','rgb(255,255,255)')

			cursor = node.append('g')
				.attr('class','cursor')
				.each(function(){
					d3.select(this)
						.append('text')
						.each(function(){
							d3.select(this)
								.append('tspan')
								.attr('x','66%')
								.attr('dy','-0.8em')
								.text('jun 05');
							d3.select(this)
								.append('tspan')
								.attr('x','66%')
								.attr('dy','1.6em')
								.text('05:05');
						})

					d3.select(this)
						.append('line')
						.attr('x1','90%')
						.attr('x2','100%')
						.attr('stroke','#FFFFFF');

					d3.select(this)
						.append('line')
						.attr('x1','0%')
						.attr('x2','10%')
						.attr('stroke','#FFFFFF');
				})

			resize();
		}

		graphicsInitialized = true;

	}

	function resize(){

		height = getBodyHeight()-70;

		node.select('line')
			.attr('y1',margin)
			.attr('y2',height);

		node.selectAll('circle.day')
			.attr('cy',function(d,i){
				return margin + dayRad + (i*((height-margin-dayRad*2)/(dates.length-1)));
			});
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
		if(wheelDelta == 0 && Math.abs(tSpeed-speed) < 0.2) {
			updateControl(paused?'Play':'Pause');
		}
		prevTimeCursor = timeCursor;
		timeCursor += (speed*60/frameRate)*(isNightTime ? 300:1) + wheelDelta*(isNightTime && pages.active.id == 'map' ? 20:1);
		timeCursor = Math.constrain(timeCursor, timeFrame[0], timeFrame[1]);
		
		// console.log(new Date(timeCursor*1000), dates[0], dates[dates.length-1]);
		
		wheelDelta = 0;
		if(new Date(timeCursor*1000).getDate() != new Date(prevTimeCursor*1000).getDate()) newDay();
		for(var i=0; i<2; i++){
			if(timeCursor < nightTime[dayCursor][i] && prevTimeCursor >= nightTime[dayCursor][i]) toggleNightTime(i,false); 
			if(timeCursor >= nightTime[dayCursor][i] && prevTimeCursor < nightTime[dayCursor][i]) toggleNightTime(i,true); 
		}

		updateCursor();
	}

	function updateCursor(){
		var y = Math.map(timeCursor*1000,totalTimeFrame[0],totalTimeFrame[1],margin,height-margin);
		cursor.attr('transform','translate(0,'+y+')');
		var d = new Date(timeCursor*1000);
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var mo = monthNames[d.getMonth()];
		var da = d.getDate();
		if(da < 10) da = '0' + da;
		cursor.select('text tspan:first-child').text(mo + ' ' + da);
		var ho = d.getHours();
		if(ho < 10) ho = '0'+ho;
		var mi = d.getMinutes();
		if(mi < 10) mi = '0'+mi;
		cursor.select('text tspan:last-child').text(ho + ':' + mi);
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
		updateControl(wheelDelta>0?'FastForward':'FastBackward');
		if(pages.active.id == 'map'){
			d3.select('#feed').node().parentNode.scrollTop += delta;
		}
	}


	function navigateJournal(t){
		tSpeed = 0;
		speed = 0;
		wheelDelta = t-timeCursor;
	}


	function getTimeCursor(){
		return {current: timeCursor, last: prevTimeCursor, day: dayCursor};
	}


	function togglePause(state){
		if(state) paused = state == 'pause';
		else paused = !paused;
		tSpeed = paused ? 0 : autoSpeed;
		updateControl(paused?'Play':'Pause');
	}

	function updateControl(state){
		// console.log(state);
		if(lastControlState != state) controlNode.style('background-image','url("static/img/icon'+state+'.svg")');
		lastControlState = state;
	}

	function setNightTime(day, interval){
		nightTime[day] = interval;
	}

	function getBodyHeight(){
		var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
		var headerHeight = d3.select('#header').node().clientHeight;
		return containerHeight - headerHeight;
	}

	return {
		init: init,
		getTimeCursor: getTimeCursor,
		navigateMap: navigateMap,
		navigateJournal: navigateJournal,
		resize: resize,
		togglePause: togglePause,
		setTimeFrame: setTimeFrame,
		setNightTime: setNightTime,
		update: update,
		updateControl: updateControl
	};
}



