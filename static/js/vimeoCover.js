console.log('1');
var playerOrigin = '*';

window.addEventListener('message', onMessageReceived, false);
function onMessageReceived(event) {
	console.log('2', event.origin);
    if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
        return false;
    }	        
    if (playerOrigin === '*') {
        playerOrigin = event.origin;
    }
    var data = JSON.parse(event.data);
	console.log('2.5', data.event);
    if(data.event == 'ready') onReady();
    if(data.event == 'play') onPlay();
}

function onReady() {
	console.log('3');
    var data = {
      method: 'addEventListener',
      value: 'play'
    };
    var message = JSON.stringify(data);
    var player = d3.select('iframe').node();
    player.contentWindow.postMessage(data, playerOrigin);
}

function onPlay(){
	console.log('4');
	d3.select('#aboutPage #video div.cover')
		.transition()
		.style('opacity',0)
		.remove();
}