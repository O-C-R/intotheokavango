var playerOrigin = '*';
var vimeoPlayer;

window.addEventListener('message', onMessageReceived, false);
function onMessageReceived(event) {
    if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
        return false;
    }           
    if (playerOrigin === '*') {
        playerOrigin = event.origin;
    }
    var data = JSON.parse(event.data);
    if(data.event == 'ready') onReady();
    if(data.event == 'play') onPlay();
}

function onReady() {
    var data = {
      method: 'addEventListener',
      value: 'play'
    };
    var message = JSON.stringify(data);
    vimeoPlayer = d3.select('iframe').node();
    vimeoPlayer.contentWindow.postMessage(data, playerOrigin);
}

function onPlay(){
    d3.select('#aboutPage #video div.cover')
        .transition()
        .style('opacity',0)
        .remove();
}

function pauseVimeoPlayer(){
    var data = {
      method: 'pause'
    };
    vimeoPlayer = d3.select('iframe').node();
    if(vimeoPlayer) vimeoPlayer.contentWindow.postMessage(data, playerOrigin);
}