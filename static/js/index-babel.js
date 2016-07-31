(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaWFhYWFuIiwiYSI6ImNpbXF1ZW4xOTAwbnl3Ymx1Y2J6Mm5xOHYifQ.6wlNzSdcTlonLBH-xcmUdQ';
var MAPBOX_STYLE = 'mapbox://styles/iaaaan/cioxda1tz000cbnm13jtwhl8q';

var Okavango = React.createClass({
  displayName: 'Okavango',

  render: function render() {
    return React.createElement(
      'div',
      { id: 'root' },
      React.createElement(Map, null),
      React.createElement(Navigation, null),
      React.createElement(Content, null)
    );
  }
});

var Map = React.createClass({
  displayName: 'Map',

  render: function render() {
    return React.createElement(
      'div',
      { id: 'mapbox' },
      React.createElement(MapGL, {
        mapStyle: MAPBOX_STYLE,
        mapboxApiAccessToken: MAPBOX_ACCESS_TOKEN,
        width: window.innerWidth, height: window.innerHeight, latitude: 37.7577, longitude: -122.4376,
        zoom: 8, onChangeViewport: function onChangeViewport(viewport) {
          var latitude = viewport.latitude;
          var longitude = viewport.longitude;
          var zoom = viewport.zoom;
          // Optionally call `setState` and use the state to update the map.
        }
      })
    );
  }
});

var Navigation = React.createClass({
  displayName: 'Navigation',

  render: function render() {
    return React.createElement(
      'div',
      { id: 'header' },
      React.createElement(
        'div',
        { id: 'navigation' },
        React.createElement(
          'ul',
          null,
          React.createElement(
            NavigationItem,
            null,
            'Map'
          ),
          React.createElement(
            NavigationItem,
            null,
            'Journal'
          ),
          React.createElement(
            NavigationItem,
            null,
            'Data'
          ),
          React.createElement(
            NavigationItem,
            { active: true },
            'About'
          ),
          React.createElement(
            NavigationItem,
            null,
            'Share'
          )
        )
      ),
      React.createElement(
        'h1',
        null,
        'INTO THE OKAVANGO'
      )
    );
  }
});

var NavigationItem = React.createClass({
  displayName: 'NavigationItem',

  render: function render() {
    var className = this.props.active ? 'active' : 'inactive';
    return React.createElement(
      'li',
      { className: className },
      React.createElement(
        'a',
        { href: '#' },
        this.props.children.toString()
      )
    );
  }
});

var Content = React.createClass({
  displayName: 'Content',


  render: function render() {

    var height = { height: window.innerHeight - 100 };

    return React.createElement(
      'div',
      { id: 'content', style: height },
      React.createElement(LightBox, null),
      React.createElement(Timeline, null),
      React.createElement(
        'div',
        { id: 'pageContainer' },
        React.createElement(MapPage, null),
        React.createElement(JournalPage, null),
        React.createElement(DataPage, { active: true }),
        React.createElement(AboutPage, null),
        React.createElement(SharePage, null)
      )
    );
  }
});

var LightBox = React.createClass({
  displayName: 'LightBox',


  render: function render() {

    var height = { height: window.innerHeight - 200 };

    var post = {
      'key': 1,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com',
      'image': 'static/img/photo.png'
    };

    var meta = {
      'type': post.type,
      'date': post.date,
      'location': post.location,
      'link': post.link
    };

    console.log(post.content, meta);

    if (this.props.active) {
      return React.createElement(
        'div',
        { id: 'lightBox' },
        React.createElement(
          'div',
          { className: 'contentWrapper', style: height },
          React.createElement(
            Post,
            { format: 'lightBox', meta: meta },
            post.image
          )
        )
      );
    } else {
      return null;
    }
  }
});

var Timeline = React.createClass({
  displayName: 'Timeline',


  render: function render() {

    return React.createElement('svg', { id: 'timeline', style: { height: window.innerHeight - 72 + 'px' } });
  }
});

var MapPage = React.createClass({
  displayName: 'MapPage',


  render: function render() {

    var notifications = [{ type: 'twitter', content: 'lorem ipsum dolor sit amet', key: 1 }, { type: 'twitter', content: 'lorem ipsum dolor sit amet', key: 2 }];

    var className = 'page ' + (this.props.active ? 'active' : 'inactive');
    var date = new Date();
    var year = 2016;
    return React.createElement(
      'div',
      { className: className, id: 'mapPage' },
      React.createElement(ControlPanel, { year: year, date: date, playback: true, focus: true, zoom: true }),
      React.createElement(NotificationPanel, { data: notifications })
    );
  }
});

var NotificationPanel = React.createClass({
  displayName: 'NotificationPanel',


  render: function render() {

    var notificationItems = this.props.data.map(function (notification) {
      return React.createElement(
        Notification,
        { type: notification.type, key: notification.key },
        notification.content
      );
    });
    return React.createElement(
      'div',
      { id: 'notificationPanel' },
      notificationItems
    );
  }
});

var Notification = React.createClass({
  displayName: 'Notification',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'notification' },
      React.createElement(
        'div',
        { className: 'content' },
        React.createElement(
          'p',
          null,
          this.props.children.toString()
        )
      ),
      React.createElement(
        'div',
        { className: 'type' },
        React.createElement('img', { width: '16', height: '16' })
      )
    );
  }
});

var JournalPage = React.createClass({
  displayName: 'JournalPage',

  render: function render() {

    var posts = [{
      'key': 1,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 2,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }, {
      'key': 3,
      'type': 'tweet',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
      'date': Date.now(),
      'location': [0, 0],
      'link': 'http://www.google.com'
    }];

    var className = 'page ' + (this.props.active ? 'active' : 'inactive');
    if (this.props.active) {
      return React.createElement(
        'div',
        { className: className, id: 'journalPage' },
        React.createElement(ControlPanel, { year: true, date: true, layout: true }),
        React.createElement(Feed, { posts: posts })
      );
    } else {
      return null;
    }
  }
});

var Feed = React.createClass({
  displayName: 'Feed',

  render: function render() {
    var format = 'full';
    var self = this;
    var posts = this.props.posts.map(function (post, i) {

      var meta = {
        'type': post.type,
        'date': post.date,
        'location': post.location,
        'link': post.link
      };

      return React.createElement(
        Post,
        { format: format, meta: meta, key: i },
        post.content
      );
    });
    return React.createElement(
      'div',
      { id: 'feed' },
      posts
    );
  }
});

var Post = React.createClass({
  displayName: 'Post',

  render: function render() {

    var self = this;
    var metaTypes = ['date'];

    if (self.props.meta.location) metaTypes.push('location');
    if (self.props.meta.link) metaTypes.push('link');

    var meta = metaTypes.map(function (m, i) {

      var value = function () {
        if (m === 'date') {
          var d = new Date(self.props.meta.date);
          var mo = d.getMonth();
          var da = d.getDate();
          var s = mo + '/' + da;
          return React.createElement(
            'p',
            null,
            s
          );
        } else if (self.props.format == 'full') {
          return React.createElement('img', { width: '16', height: '16', key: i });
        }
      }();

      return React.createElement(
        'div',
        { className: m, key: i },
        value
      );
    });

    if (self.props.format === 'full') {

      return React.createElement(
        'div',
        { className: 'post' },
        React.createElement(
          'div',
          { className: 'type' },
          React.createElement('img', { width: '16', height: '16' })
        ),
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(
            'p',
            { className: 'message' },
            self.props.children.toString()
          ),
          React.createElement(
            'div',
            { className: 'meta' },
            meta,
            React.createElement(
              'div',
              { className: 'share' },
              React.createElement('img', { width: '16', height: '16' })
            ),
            React.createElement('div', { className: 'separator' })
          )
        )
      );
    }

    if (self.props.format === 'lightBox') {
      return React.createElement(
        'div',
        { className: 'post lightBox' },
        React.createElement(
          'div',
          { className: 'type' },
          React.createElement('img', { width: '16', height: '16' }),
          React.createElement(
            'div',
            { className: 'meta' },
            meta
          )
        ),
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement('img', { src: self.props.children.toString() })
        ),
        React.createElement(
          'div',
          { className: 'actions' },
          React.createElement(
            'div',
            { className: 'close' },
            React.createElement('img', { width: '16', height: '16' })
          ),
          React.createElement(
            'div',
            { className: 'share' },
            React.createElement('img', { width: '16', height: '16' })
          ),
          React.createElement(
            'div',
            { className: 'permaLink' },
            React.createElement('img', { width: '16', height: '16' })
          )
        )
      );
    }
  }
});

var ControlPanel = React.createClass({
  displayName: 'ControlPanel',

  render: function render() {

    return React.createElement(
      'div',
      { className: 'controlPanel' },
      this.props.year ? React.createElement(YearSelector, { year: this.props.year }) : null,
      this.props.date ? React.createElement(DateSelector, { date: this.props.date }) : null,
      this.props.playback ? React.createElement(PlaybackSelector, { forward: true }) : null,
      this.props.focus ? React.createElement(FocusSelector, null) : null,
      this.props.zoom ? React.createElement(ZoomSelector, null) : null,
      this.props.layout ? React.createElement(LayoutSelector, null) : null
    );
  }
});

var YearSelector = React.createClass({
  displayName: 'YearSelector',


  toggleDropdown: function toggleDropdown() {
    document.getElementById("YearSelectorDropdown").classList.toggle("show");
  },
  pickYear: function pickYear(e) {
    // e.target.textContent
    // d3.selectAll('div.yearSelector button').
  },
  render: function render() {

    return React.createElement(
      'div',
      { className: 'dropdown yearSelector' },
      React.createElement(
        'button',
        { onClick: this.toggleDropdown, className: 'dropbtn' },
        '2016 Expedition'
      ),
      React.createElement(
        'div',
        { id: 'YearSelectorDropdown', className: 'dropdown-content' },
        React.createElement(
          'a',
          { href: '#', onClick: this.pickYear },
          '2016'
        ),
        React.createElement(
          'a',
          { href: '#', onClick: this.pickYear },
          '2015'
        ),
        React.createElement(
          'a',
          { href: '#', onClick: this.pickYear },
          '2014'
        ),
        React.createElement(
          'a',
          { href: '#', onClick: this.pickYear },
          '2013'
        )
      )
    );
  }
});

var DateSelector = React.createClass({
  displayName: 'DateSelector',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'dateSelector' },
      React.createElement(
        'p',
        null,
        'DAY 12'
      ),
      React.createElement(
        'p',
        null,
        'August 18, 15:03'
      ),
      React.createElement(
        'p',
        null,
        'CUITO SOURCE'
      )
    );
  }
});

var PlaybackSelector = React.createClass({
  displayName: 'PlaybackSelector',

  render: function render() {
    var types = ['fastBackward', 'backward', 'pause', 'forward', 'fastForward'];
    var that = this;
    var buttons = types.map(function (s, i) {
      var className = 'playbackButton ' + (that.props[s] ? 'active' : 'inactive');
      return React.createElement(
        'li',
        { className: className, key: i },
        React.createElement('img', { width: '16', height: '16' })
      );
    });
    return React.createElement(
      'ul',
      { className: 'playbackSelector buttonRow' },
      buttons
    );
  }
});

var FocusSelector = React.createClass({
  displayName: 'FocusSelector',

  toggleDropdown: function toggleDropdown() {
    document.getElementById("FocusSelectorOptions").classList.toggle("show");
  },
  pickMainFocus: function pickMainFocus(e) {
    // e.target.textContent
    // d3.selectAll('div.yearSelector button').
  },
  render: function render() {

    return React.createElement(
      'div',
      { className: 'focusSelector' },
      React.createElement(
        'p',
        null,
        'Focus on:'
      ),
      React.createElement(
        'div',
        { className: 'dropdown' },
        React.createElement(
          'button',
          { onClick: this.toggleDropdown, className: 'dropbtn' },
          'Explorers'
        ),
        React.createElement(
          'div',
          { id: 'FocusSelectorOptions', className: 'dropdown-content' },
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2016'
          ),
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2015'
          ),
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2014'
          ),
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2013'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'dropdown' },
        React.createElement(
          'button',
          { onClick: this.toggleDropdown, className: 'dropbtn' },
          'Steve'
        ),
        React.createElement(
          'div',
          { id: 'FocusSelectorOptions', className: 'dropdown-content' },
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2016'
          ),
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2015'
          ),
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2014'
          ),
          React.createElement(
            'a',
            { href: '#', onClick: this.pickMainFocus },
            '2013'
          )
        )
      )
    );
  }
});

var ZoomSelector = React.createClass({
  displayName: 'ZoomSelector',

  render: function render() {
    var types = ['minus', 'plus'];
    var that = this;
    var buttons = types.map(function (s, i) {
      return React.createElement(
        'li',
        { className: 'zoomButton', key: i },
        React.createElement('img', { width: '16', height: '16' })
      );
    });
    return React.createElement(
      'div',
      { className: 'selector' },
      React.createElement(
        'div',
        { className: 'column' },
        React.createElement(
          'ul',
          { className: 'buttonRow' },
          buttons
        )
      ),
      React.createElement('svg', { className: 'column' })
    );
  }
});

var LayoutSelector = React.createClass({
  displayName: 'LayoutSelector',

  render: function render() {
    var types = ['rows', 'grid'];
    var that = this;
    var buttons = types.map(function (s, i) {
      return React.createElement(
        'li',
        { className: 'layoutButton', key: i },
        React.createElement('img', { width: '16', height: '16' })
      );
    });
    return React.createElement(
      'div',
      { className: 'selector' },
      React.createElement(
        'div',
        { className: 'column' },
        React.createElement(
          'ul',
          { className: 'buttonRow' },
          buttons
        )
      )
    );
  }
});

var DataPage = React.createClass({
  displayName: 'DataPage',

  render: function render() {

    var className = 'page ' + (this.props.active ? 'active' : 'inactive');

    var sections = [{ 'key': 1, 'title': 'Overview', 'content': React.createElement(
        'p',
        null,
        'Lorem ipsum dolor sit amet'
      )
    }, { 'key': 2, 'title': 'API exploration tool', 'content': React.createElement(APIExplorer, null)
    }, { 'key': 3, 'title': 'Documentation', 'content': React.createElement(
        'p',
        null,
        'Lorem ipsum dolor sit amet'
      )
    }];

    var index = sections.map(function (section) {
      return React.createElement(
        'h3',
        { key: section.key },
        section.key,
        ' - ',
        section.title
      );
    });

    var content = sections.map(function (section) {
      return React.createElement(
        'div',
        { key: section.key },
        React.createElement(
          'h2',
          null,
          section.key,
          ' - ',
          section.title
        ),
        section.content
      );
    });

    return React.createElement(
      'div',
      { className: className, id: 'dataPage' },
      React.createElement(
        DataPageIndex,
        null,
        index
      ),
      React.createElement(
        'div',
        { id: 'dataPageContent' },
        content
      )
    );
  }
});

var DataPageIndex = React.createClass({
  displayName: 'DataPageIndex',

  render: function render() {
    return React.createElement(
      'div',
      { id: 'APIIndex' },
      this.props.children
    );
  }
});

var APIExplorer = React.createClass({
  displayName: 'APIExplorer',

  render: function render() {
    return React.createElement(
      'p',
      null,
      'DATA API EXPLORER'
    );
  }
});

var AboutPage = React.createClass({
  displayName: 'AboutPage',

  render: function render() {
    var className = 'page ' + (this.props.active ? 'active' : 'inactive');
    return React.createElement(
      'div',
      { className: className, id: 'aboutPage' },
      React.createElement(
        'div',
        { className: 'pageWrapper' },
        React.createElement('video', null),
        React.createElement(
          'div',
          { className: 'columnWrapper' },
          React.createElement(
            'div',
            { className: 'column headline' },
            React.createElement(
              'p',
              null,
              '120 days, 1,500 miles, 3 countries,',
              React.createElement('br', null),
              '2 rivers, 31 adventurers, 100% open data.',
              React.createElement('br', null),
              'Join us in real-time as we explore'
            ),
            React.createElement(
              'h1',
              null,
              'THE BEATING HEART OF OUR PLANET'
            )
          ),
          React.createElement(
            'div',
            { className: 'column' },
            React.createElement(
              'p',
              null,
              'The Okavango Delta is one of the world’s last great wetland wildernesses. Although the Delta has been awarded UNESCO WHS Status its catchments in the highlands of Angola are still unprotected and largely unstudied. Starting in May a team of Ba’Yei, scientists, engineers and adventurers will journey a 1500 miles down the Cuito River, finding new species, exploring new ground, and taking the pulse of this mighty river that brings life-giving water to the Jewel of the Kalahari.'
            ),
            React.createElement(
              'p',
              null,
              'This site displays data which is uploaded daily, via satellite, by the expedition team. Data is also available through a public API, allowing anyone to remix, analyze or visualize the collected information.'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'columnWrapper' },
          React.createElement('div', { className: 'column' }),
          React.createElement('div', { className: 'column' })
        ),
        React.createElement(
          'div',
          { className: 'columnWrapper' },
          React.createElement('div', { className: 'column' }),
          React.createElement('div', { className: 'column' })
        )
      )
    );
  }
});

var SharePage = React.createClass({
  displayName: 'SharePage',

  render: function render() {
    var className = 'page ' + (this.props.active ? 'active' : 'inactive');
    return React.createElement(
      'div',
      { className: className, id: 'sharePage' },
      'Share page'
    );
  }
});

// console.log('aga1')

// var Navigation = React.createClass({
//   render: function(){
//     return (<p></p>)
//   }
// })


// var MapPage = React.createClass({
//   render: function(){
//     return (<p></p>)
//   }
// })

// var JournalPage = React.createClass({
//   render: function(){
//     return (<p></p>) 
//   }
// })

// var DataPage = React.createClass({
//   render: function(){
//     return (<p></p>) 
//   }
// })

// var AboutPage = React.createClass({
//   render: function(){
//     return (<p></p>) 
//   }
// })


var CommentList = React.createClass({
  displayName: 'CommentList',

  render: function render() {

    var commentNodes = this.props.data.map(function (comment) {
      return React.createElement(
        Comment,
        { author: comment.author, key: comment.id },
        comment.text
      );
    });

    return React.createElement(
      'div',
      { className: 'commentList' },
      commentNodes
    );
  }
});

var CommentForm = React.createClass({
  displayName: 'CommentForm',

  getInitialState: function getInitialState() {
    return { author: '', text: '' };
  },
  handleAuthorChange: function handleAuthorChange(e) {
    this.setState({ author: e.target.value });
  },
  handleTextChange: function handleTextChange(e) {
    this.setState({ text: e.target.value });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    this.setState({ author: '', text: '' });
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'commentForm', onSubmit: this.handleSubmit },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Your name',
        value: this.state.author,
        onChange: this.handleAuthorChange
      }),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Say something...',
        value: this.state.text,
        onChange: this.handleTextChange
      }),
      React.createElement('input', { type: 'submit', value: 'Post' })
    );
  }
});

var Comment = React.createClass({
  displayName: 'Comment',


  rawMarkup: function rawMarkup() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function render() {
    var md = new Remarkable();
    return React.createElement(
      'div',
      { className: 'comment' },
      React.createElement(
        'h2',
        { className: 'commentAuthor' },
        this.props.author
      ),
      React.createElement('span', { dangerouslySetInnerHTML: this.rawMarkup() })
    );
  }
});

//

var CommentBox = React.createClass({
  displayName: 'CommentBox',

  loadCommentsFromServer: function loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  componentDidMount: function componentDidMount() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  handleCommentSubmit: function handleCommentSubmit(comment) {
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({ data: newComments });
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'commentBox' },
      React.createElement(
        'h1',
        null,
        'Comments'
      ),
      React.createElement(CommentList, { data: this.state.data }),
      React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit })
    );
  }
});

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

ReactDOM.render(
// <CommentBox url="/api/comments" pollInterval={2000} />,
React.createElement(Okavango, null), document.getElementById('okavango'));

},{}]},{},[1]);
