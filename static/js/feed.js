

function Feed(){

	var node = d3.select('#feed');
	node.on('mousewheel', scroll);
	var templates = {
		tweet: node.select('div.post.tweet').remove().html(),
		photo: node.select('div.post.photo').remove().html()
	}


	function init(){
		var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

		var postData = [];
		postData = postData.concat(tweets);
		postData = postData.concat(photos);
		postData.sort(function(a, b){
			return a.getData().date.getTime() - b.getData().date.getTime();
		});

		var posts = node.selectAll('div.post')
	        .data(postData)
	        .enter()
	        .append('div')
	        .attr("class", function(d) { return ' post ' + d.getData().type; })
	        .html(function(d){ return templates[d.getData().type] })
	        .each(function(d,i){
	        	d = d.getData();
	        	if(d.type == 'tweet'){
		        	var t = d.date;
		        	t.setTime(t.getTime() + ((new Date().getTimezoneOffset() + 2) * 60 * 1000))
		        	t = ((parseInt(t.getDate())+1) + monthNames[t.getMonth()] + ' ' + ((t.getHours()+'').length==1?'0':'') + t.getHours() + ':'+ ((t.getMinutes()+'').length==1?'0':'') +t.getMinutes());
		        	d3.select(this).select('div.meta div.timestamp')
		        		.html(t);

		        	d3.select(this).select('p.message')
		        		.html(function(){
		        			return '“'+d.message.replace(/http[^\s]*/,'')+'”';
		        		});

		        	if(d.photoUrl){
			        	d3.select(this).select('div.photo')
			        		.html('<img src = "'+d.photoUrl+'" alt="Photo taken on '+ t +'"/>');
		        	}

	        	} else if(d.type == 'photo'){
		        	var t = d.date;
		        	t.setTime(t.getTime() + ((new Date().getTimezoneOffset() + 2) * 60 * 1000))
		        	t = ((parseInt(t.getDate())+1) + monthNames[t.getMonth()] + ' ' + ((t.getHours()+'').length==1?'0':'') + t.getHours() + ':'+ ((t.getMinutes()+'').length==1?'0':'') +t.getMinutes());
		        	d3.select(this).select('div.meta div.timestamp')
		        		.html(t);

		        	d3.select(this).select('div.photo')
		        		.html('<img src = "http://intotheokavango.org'+d.photoUrl+'" alt="Photo taken on '+ t +'"/>');
	        	}
		        // d.setFeedPos(this.offsetTop, this.clientHeight);
	        });
	}

	
	function scroll(){
		var y = node.node().parentNode.scrollTop;
		// posts.each(function(d,i){
		// 	d = d.getData();
		// 	if(d.feedPos <= y)
		// })
		timeline.navigateJournal(d3.event.wheelDeltaY);
	}
	

	return{
		init: init
	};
}

