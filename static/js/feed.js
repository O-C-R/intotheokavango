

/*
	Describes the journal page's feed.
*/


function Feed(){

	var node = d3.select('#feed');
	node.on('mousewheel', scroll);
	var templates = {
		tweet: node.select('div.post.tweet').remove().html(),
		photo: node.select('div.post.photo').remove().html()
	}
	var postsByDay = [];
	var allPosts = [];


	function init(day){
		var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		var w = node.style('width');
		w = parseFloat(+w.slice(0,w.length-2));

		var newPosts = [];
		newPosts = newPosts.concat(loader.getTweets()[day]);
		newPosts = newPosts.concat(loader.getPhotos()[day]);
		newPosts.sort(function(a, b){
			return a.getData().date.getTime() - b.getData().date.getTime();
		});
		postsByDay[day] = newPosts;
		allPosts = allPosts.concat(newPosts);

		var posts = node.selectAll('div.post')
	        .data(allPosts)
	        .enter()
	        .append('div')
	        .attr("class", function(d) { return ' post ' + d.getData().type; })
	        .html(function(d){ return templates[d.getData().type] })
	        .each(function(d,i){
	        	d = d.getData();
	        	
	        	var t = d.date;
	        	t.setTime(t.getTime() + ((new Date().getTimezoneOffset() + 2) * 60 * 1000))
	        	t = ((parseInt(t.getDate())+1) + monthNames[t.getMonth()] + ' ' + ((t.getHours()+'').length==1?'0':'') + t.getHours() + ':'+ ((t.getMinutes()+'').length==1?'0':'') +t.getMinutes());
	        	d3.select(this).select('div.meta div.timestamp')
	        		.html(t);
	        	
	        	if(d.type == 'tweet'){
		        	d3.select(this).select('p.message')
		        		.html(function(){
		        			return '“'+d.message.replace(/http[^\s]*/,'')+'”';
		        		});
		        	if(d.photoUrl){
			        	d3.select(this).select('div.photo')
			        		.append('img')
			        		.attr('src',d.photoUrl)
			        		.attr('alt','Photo taken on ' + t)
			        		.attr('width', w)
			        		.attr('height', d.size[1]*w/d.size[0]);
		        	}
	        	} else if(d.type == 'photo'){
		        	d3.select(this).select('div.photo')
		        		.append('img')
		        		.attr('src','http://intotheokavango.org'+d.photoUrl)
		        		.attr('alt','Photo taken on ' + t)
		        		.attr('width', w)
		        		.attr('height', d.size[1]*w/d.size[0]);
	        	}

		        d.setFeedPos(this.offsetTop, this.clientHeight);
	        });
	}

	
	function scroll(){
		var day = timeline.getTimeCursor().day;
		var y = node.node().parentNode.scrollTop;

		var len = postsByDay[day].length;
		for(var i=0; i<len; i++){
			var post = postsByDay[day][i];
			var d1 = post.getData();
			if(y >= d1.feedPos-35 && y < d1.feedPos+d1.height){
				if(!postsByDay[day][i+1] && !postsByDay[day+1]) break
				var nextPost = postsByDay[day][i+1] || postsByDay[day+1][0];
				// console.log(nextPost);
				var d2 = nextPost.getData();
				timeline.navigateJournal(Math.round(Math.map(y,d1.feedPos-35,d1.feedPos+d1.height,d1.date.getTime(),d2.date.getTime())/1000));
				break;
			}
		}
	}
	

	return{
		init: init
	};
}

