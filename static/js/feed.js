

/*
	Describes the journal page's feed.
*/


function Feed(){

	var node = d3.select('#feed');
	node.on('wheel', scroll);
	var templates = {
		tweet: node.select('div.post.tweet').remove().html(),
		photo: node.select('div.post.photo').remove().html(),
		blog: node.select('div.post.blog').remove().html(),
		sound: node.select('div.post.sound').remove().html()
	}
	var postsByDay = [];
	var allPosts = [];
	var posts;
	var postCursor = 0;
	var resizing = false;

	function init(day){
		
		var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		var w = d3.select(node.node().parentNode).style('width');
		w = Math.round(parseFloat(w)/100*d3.select('body').node().clientWidth);

		// Definitely not optimized
		var newPosts = [];
		newPosts = newPosts.concat(loader.getTweets()[day]);
		newPosts = newPosts.concat(loader.getBlogs()[day]);
		newPosts = newPosts.concat(loader.getSounds()[day]);
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

		posts = node.selectAll('div.post')
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
			        		.on('load',function(){
			        			jump();
			        		})
		        	}
	        	} else if(d.type == 'photo'){
		        	d3.select(this).select('div.photo')
		        		.append('img')
		        		.attr('src','http://intotheokavango.org'+d.photoUrl)
		        		.attr('alt','Photo taken on ' + t)

		        	if(d.notes){
			        	d3.select(this).select('p.notes')
			        		.html(function(){
			        			var urls = d.notes.match(/http[^\s]*/gi);
			        			if(urls){
				        			for(var i=0; i<urls.length; i++){
				        				d.notes = d.notes.replace(urls[i],'<a href="'+urls[i]+'" target="_blank">'+urls[i]+'</a>');
				        			}
				        		}
			        			return d.notes
			        		})
		        	}
		        	if(d.size[0]<d.size[1]) d3.select(this).classed('vertical',true);
	        	} else if(d.type == 'blog'){
		        	d3.select(this).select('h3.title')
		        		.html(d.title);
	        		d3.select(this).select('p.message')
		        		.html(function(){
		        			return '"' + d.message + ' [...]"<br/><a href="'+d.url+'" target="_blank">Read the full article on Medium</a>'
		        		});
	        	} else if(d.type == 'sound'){
	        		d3.select(this).select('p.notes')
		        		.html(d.notes);
		        	d3.select(this).select('div.text iframe')
		        		.attr('src','https://w.soundcloud.com/player/?url='+d.url+'&color=4BFF87&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false');
	        	}
	        });

		posts.order();
		jump();

	}


	function scroll(){
		var y = node.node().parentNode.scrollTop;
		var len = allPosts.length;
		for(var i=0; i<len-1; i++){
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
				timeline.navigateJournal(t);
				postCursor = i;
				return;
			}
		}
	}


	function jump(preventJump){
		var t = timeline.getTimeCursor();
		if(!resizing){
			requestAnimationFrame(function(){
				if(posts){
					posts.each(function(d){
						d.setFeedPos(this.offsetTop, this.clientHeight);
					});
				}
				resizing = false;
				if(!preventJump){
					var len = allPosts.length;
					for(var i=0; i<len-1; i++){
						var post = allPosts[i];
						var nextPost = allPosts[i+1];
						var t1 = post.getData().date.getTime()/1000;
						var t2 = nextPost.getData().date.getTime()/1000;
						if(t.current >= t1 && t.current < t2){
							var d = post.getData();
							requestAnimationFrame(function(){
								node.node().parentNode.scrollTop = Math.map(t.current,t1,t2,d.feedPos,d.feedPos + d.height);
							})
							postCursor = i;
							break;
						}
					}
				}
			});
		}
		resizing = true;
	}
	

	return{
		init: init,
		jump: jump,
	};
}

