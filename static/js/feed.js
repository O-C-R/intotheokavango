

/*
	Describes the journal page's feed.
*/


function Feed(){

	var node = d3.select('#feed');
	node.on('wheel', scroll);
	var templates = {
		tweet: node.select('div.post.tweet').remove().html(),
		photo: node.select('div.post.photo').remove().html(),
		blog: node.select('div.post.blog').remove().html()
	}
	var postsByDay = [];
	var allPosts = [];
	var postCursor = 0;

	var initialized = false;


	function init(day){
		var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		var w = node.style('width');
		w = parseFloat(+w.slice(0,w.length-2));

		// Definitely not optimized
		var newPosts = [];
		newPosts = newPosts.concat(loader.getTweets()[day]);
		newPosts = newPosts.concat(loader.getBlogs()[day]);
		var photos = loader.getPhotos()[day];
		for(var i=0; i<photos.length; i++){
			if(photos[i].getMember() != null) newPosts.push(photos[i]);
		}
		newPosts.sort(function(a, b){
			return a.getData().date.getTime() - b.getData().date.getTime();
		});
		postsByDay[day] = newPosts;
		allPosts = allPosts.concat(newPosts);
		allPosts.sort(function(a, b){
			return a.getData().date.getTime() - b.getData().date.getTime();
		});

		var posts = node.selectAll('div.post')
	        .data(allPosts, function(d){ 
	        	d = d.getData();
	        	return d.date.getTime() + '-' + d.latLng.lat;
	        })

	    posts.enter()
	        .append('div')
	        .attr("class", function(d) { return ' post ' + d.getData().type; })
	        .html(function(d){ return templates[d.getData().type] })
	        .each(function(d,i){
	        	d = d.getData();
	        	var t = new Date(offsetTimezone(d.date.getTime()));
	        	t = ((parseInt(t.getDate())) + monthNames[t.getMonth()] + ' ' + ((t.getHours()+'').length==1?'0':'') + t.getHours() + ':'+ ((t.getMinutes()+'').length==1?'0':'') +t.getMinutes());
	        	d3.select(this).select('div.meta div.timestamp')
	        		.html(t);
	        	
	        	if(d.type == 'tweet'){
		        	d3.select(this).select('p.message')
		        		.html(function(){
		        			var urls = d.message.match(/http[^\s]*/gi);
		        			if(urls){
			        			for(var i=0; i<urls.length; i++){
			        				d.message = d.message.replace(urls[i],'<a href="'+urls[i]+'" target="_blank">'+urls[i]+'</a>');
			        			}
			        		}
			        		var handles = d.message.match(/@[^\s]*/gi);
		        			if(handles){
			        			for(var i=0; i<handles.length; i++){
			        				d.message = d.message.replace(handles[i],'<a href="http://twitter.com/'+handles[i].slice(1,handles[i].length-1)+'" target="_blank">'+handles[i]+'</a>');
			        			}
			        		}
		        			return d.message
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
	        	} else if(d.type == 'blog'){
		        	d3.select(this).select('h3.title')
		        		.html(d.title);
	        		d3.select(this).select('p.message')
		        		.html(function(){
		        			return '"' + d.message + ' [...]"<br/><a href="'+d.url+'" target="_blank">Read the full article on Medium</a>'
		        		});
	        	}
	        });

		posts.order();

		requestAnimationFrame(function(){
			posts.each(function(d){
				d.setFeedPos(this.offsetTop, this.clientHeight);
			});
			if(pages.active.id == 'journal'){
				jump(timeline.getTimeCursor());
			}
		});

		initialized = false;

	}

	function scroll(){
		var day = timeline.getTimeCursor().day;
		var y = node.node().parentNode.scrollTop;
		var forward = d3.event.wheelDeltaY <= 0;
		var fw = forward ? 1:-1;

		var len = allPosts.length;
		for(var i=Math.constrain(postCursor-fw,0,len-1); forward?(i<len-1):(i>=0); i+=fw){
			var post = allPosts[i];
			var d1 = post.getData();
			if(y >= d1.feedPos && y < d1.feedPos+d1.height + 70){
				var nextPost = allPosts[i+1];
				var t;
				if(nextPost){
					var d2 = nextPost.getData();
					t = Math.round(Math.map(y,d1.feedPos,d1.feedPos+d1.height+70,d1.date.getTime(),d2.date.getTime())/1000);
				} else{
					t = Math.round(Math.map(y,d1.feedPos,d1.feedPos+d1.height+70,d1.date.getTime(),d1.date.getTime()+1)/1000);
				}
				// if(Math.abs(t-timeline.getTimeCursor().current) > 3600*24) timeline.jumpTo(t);
				// else timeline.navigateJournal(t);
				timeline.navigateJournal(t);
				postCursor = i;
				return;
			}
		}
	}


	function jump(t){

		var day = t.day;
		var len = postsByDay[day].length;
		for(var i=0; i<len; i++){
			if(!postsByDay[day][i+1] && !postsByDay[day+1]) break;
			var post = postsByDay[day][i];
			var nextPost = postsByDay[day][i+1] || postsByDay[day+1][0];
			var t1 = post.getData().date.getTime()/1000;
			var t2 = nextPost.getData().date.getTime()/1000;
			if(t.current >= t1 && t.current < t2){
				var d = post.getData();
				node.node().parentNode.scrollTop = Math.map(t.current,t1,t2,d.feedPos,d.feedPos + d.height);
				var id = 0;
				for(var j=0; j<day; j++){
					if(postsByDay[j]) id += postsByDay[j].length
				}
				id += i;
				postCursor = id;
				break;
			}
		}
	}
	

	return{
		init: init,
		jump: jump
	};
}

