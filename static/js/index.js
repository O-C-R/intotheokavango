


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaWFhYWFuIiwiYSI6ImNpbXF1ZW4xOTAwbnl3Ymx1Y2J6Mm5xOHYifQ.6wlNzSdcTlonLBH-xcmUdQ';
const MAPBOX_STYLE = 'mapbox://styles/iaaaan/cioxda1tz000cbnm13jtwhl8q';

var initialState = {
  'currentPage' : 'map'
}

var reducer = function(state = initialState, action){
  switch(action.type){
    case 'NAV-MAP':
      state.currentPage = 'map'
      break
    case 'NAV-JOURNAL':
      state.currentPage = 'journal'
      break
    case 'NAV-DATA':
      state.currentPage = 'data'
      break
    case 'NAV-ABOUT':
      state.currentPage = 'about'  
      break
  }
  return state
}

const store = createStore(reducer)

var Okavango = React.createClass({
  render: function(){
    return (
      <div id="root">
        <Map/>
        <Navigation/>
        <Content/>
      </div>
    )
  }
})



var Navigation = React.createClass({
  render: function(){

    var currentPage = store.getState().currentPage

    return (
      <div id="header">
        <div id="navigation">
          <ul>
            <NavigationItem active={currentPage == 'map'} >Map</NavigationItem>
            <NavigationItem active={currentPage == 'journal'} >Journal</NavigationItem>
            <NavigationItem active={currentPage == 'data'} >Data</NavigationItem>
            <NavigationItem active={currentPage == 'about'} >About</NavigationItem>
            <NavigationItem active={currentPage == 'share'} >Share</NavigationItem>
          </ul>
        </div>
        <h1>INTO THE OKAVANGO</h1>
      </div>
    )
  }
})

var NavigationItem = React.createClass({
  onClick: function(e){
    store.dispatch({type:'NAV-'+e.target.textContent.toUpperCase()})
  },
  render: function(){
    var className = this.props.active?'active':'inactive'
    return (
      <li className={className} onClick={this.onClick}><a href="#">{this.props.children.toString()}</a></li>
    )
  }
})


var Map = React.createClass({
  render: function(){
    return (
      <div id="mapbox">
        <MapGL 
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width={window.innerWidth} height={window.innerHeight} latitude={37.7577} longitude={-122.4376}
          zoom={8} onChangeViewport={(viewport) => {
            const {latitude, longitude, zoom} = viewport;
            // Optionally call `setState` and use the state to update the map.
          }}
        />
      </div>
    )
  }
})




var Content = React.createClass({

  render: function(){

    var height = {height: window.innerHeight-100}
    var currentPage = store.getState().currentPage
 
    return (
      <div id="content" style={height}>
        <LightBox/>
        <Timeline/>
        <div id="pageContainer">
          <MapPage active={currentPage == 'map'}/>
          <JournalPage active={currentPage == 'journal'}/>
          <DataPage active={currentPage == 'data'}/>
          <AboutPage active={currentPage == 'about'}/>
          <SharePage/>
        </div>
      </div>
    )
  }
})

var LightBox = React.createClass({

  render: function(){

    var height = {height: window.innerHeight-200}

    var post = {
      'key':1,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com',
      'image': 'static/img/photo.png'
    }

    var meta = {
      'type':post.type,
      'date':post.date,
      'location':post.location,
      'link':post.link
    }

    if(this.props.active){
      return(
        <div id="lightBox">
          <div className="contentWrapper" style={height}>
            <Post format="lightBox" meta={meta}>
              {post.image}
            </Post>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
})





var Timeline = React.createClass({

  render: function(){

    return (
      <svg id="timeline" style={{height:(window.innerHeight)-72+'px'}}></svg>
    )
  }
})

var MapPage = React.createClass({

  render: function(){

    var notifications = [
      {type:'twitter',content:'lorem ipsum dolor sit amet',key:1},
      {type:'twitter',content:'lorem ipsum dolor sit amet',key:2}
    ]

    var className = 'page ' + (this.props.active?'active':'inactive')
    var date = new Date()
    var year = 2016
    return (
      <div className={className} id="mapPage">
        <ControlPanel year={year} date={date} playback focus zoom/>
        <NotificationPanel data={notifications}/>
      </div>
    )
  }
})


var NotificationPanel = React.createClass({
  
  render: function(){

    var notificationItems = this.props.data.map(function(notification) {
      return (
        <Notification type={notification.type} key={notification.key}>
          {notification.content}
        </Notification>
      )
    })
    return (
      <div id="notificationPanel">
        {notificationItems}
      </div>
    )
  }
})

var Notification = React.createClass({
  render: function(){
    return (
      <div className="notification">
        <div className="content">
          <p>{this.props.children.toString()}</p>
        </div>
        <div className="type">
          <img width="16" height="16"/>
        </div>
      </div>
    )
  }
})


var JournalPage = React.createClass({
  render: function(){
    
    var posts = [
      {
        'key':1,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':2,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      },
      {
        'key':3,
        'type':'tweet',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
        'date': Date.now(),
        'location': [0,0],
        'link': 'http://www.google.com'
      }
    ]


    var className = 'page ' + (this.props.active?'active':'inactive')
    if(this.props.active){
      return (
        <div  className={className}  id="journalPage">
          <ControlPanel year date layout/>
          <Feed posts={posts}/>
        </div>
      )
    } else {
      return null
    }
  }
})


var Feed = React.createClass({
  render: function(){
    var format = 'full'
    var self = this
    var posts = this.props.posts.map(function(post, i){

      var meta = {
        'type':post.type,
        'date':post.date,
        'location':post.location,
        'link':post.link
      }


      return (
        <Post format={format} meta={meta} key={i}>
          {post.content}
        </Post>
      )
    })
    return (
      <div id="feed">
        {posts}
      </div>
    )
  }
})


var Post = React.createClass({
  render: function(){

    var self = this
    var metaTypes = ['date']

    if(self.props.meta.location) metaTypes.push('location')
    if(self.props.meta.link) metaTypes.push('link')
    

    var meta = metaTypes.map(function(m,i){
      
      var value = (function(){
        if(m === 'date') {
          var d = new Date(self.props.meta.date)
          var mo = d.getMonth()
          var da = d.getDate()
          var s = mo + '/' + da
          return (<p>{s}</p>)
        } else if(self.props.format == 'full') {
          return (<img width="16" height="16" key={i}/>)
        }
      })()
      
      return (
        <div className={m} key={i}>{value}</div>
      )
    })

    if(self.props.format === 'full'){

      return (
        <div className="post">
          <div className="type">
            <img width="16" height="16"/>
          </div>
          <div className="content">
            <p className="message">{self.props.children.toString()}</p>
            <div className="meta">
              {meta}
              <div className="share"><img width="16" height="16" /></div>
              <div className="separator"></div>
            </div>
          </div>
        </div>
      )
    }

    if(self.props.format === 'lightBox'){
      return (
        <div className="post lightBox">
          <div className="type">
            <img width="16" height="16"/>
            <div className="meta">
              {meta}
            </div>
          </div>
          <div className="content">
            <img src={self.props.children.toString()}/>
          </div>
          <div className="actions">
            <div className="close"><img width="16" height="16" /></div>
            <div className="share"><img width="16" height="16" /></div>
            <div className="permaLink"><img width="16" height="16" /></div>
          </div>
        </div>
      )
    }

  }
})





var ControlPanel = React.createClass({
  render: function(){

    return(
      <div className="controlPanel">
        {this.props.year?<YearSelector year={this.props.year} />:null}
        {this.props.date?<DateSelector date={this.props.date}/>:null}
        {this.props.playback?<PlaybackSelector forward/>:null}
        {this.props.focus?<FocusSelector/>:null}
        {this.props.zoom?<ZoomSelector/>:null}
        {this.props.layout?<LayoutSelector/>:null}
      </div>
    )
  }
})

var YearSelector = React.createClass({

  toggleDropdown: function(){
    document.getElementById("YearSelectorDropdown").classList.toggle("show");
  },
  pickYear: function(e){
    // e.target.textContent
    // d3.selectAll('div.yearSelector button').
  },
  render: function(){

    return (
      <div className="dropdown yearSelector">
        <button onClick={this.toggleDropdown} className="dropbtn">2016 Expedition</button>
        <div id="YearSelectorDropdown" className="dropdown-content">
          <a href="#" onClick={this.pickYear}>2016</a>
          <a href="#" onClick={this.pickYear}>2015</a>
          <a href="#" onClick={this.pickYear}>2014</a>
          <a href="#" onClick={this.pickYear}>2013</a>
        </div>
      </div>
    )
  }
})

var DateSelector = React.createClass({
  render: function(){
    return (
      <div className="dateSelector">
        <p>DAY 12</p>
        <p>August 18, 15:03</p>
        <p>CUITO SOURCE</p>
      </div>
    )
  }
})

var PlaybackSelector = React.createClass({
  render: function(){
    var types = ['fastBackward','backward','pause','forward','fastForward']
    var that = this
    var buttons = types.map(function(s,i){
      var className = 'playbackButton ' + (that.props[s]?'active':'inactive')
      return (
        <li className={className} key={i}>
          <img width="16" height="16"/>
        </li>
      )
    })
    return (
      <ul className="playbackSelector buttonRow">
        {buttons}
      </ul>
    )
  }
})

var FocusSelector = React.createClass({
  toggleDropdown: function(){
    document.getElementById("FocusSelectorOptions").classList.toggle("show");
  },
  pickMainFocus: function(e){
    // e.target.textContent
    // d3.selectAll('div.yearSelector button').
  },
  render: function(){

    return (
      <div className="focusSelector">
        <p>Focus on:</p>
        <div className="dropdown">
          <button onClick={this.toggleDropdown} className="dropbtn">Explorers</button>
          <div id="FocusSelectorOptions" className="dropdown-content">
            <a href="#" onClick={this.pickMainFocus}>2016</a>
            <a href="#" onClick={this.pickMainFocus}>2015</a>
            <a href="#" onClick={this.pickMainFocus}>2014</a>
            <a href="#" onClick={this.pickMainFocus}>2013</a>
          </div>
        </div>
        <div className="dropdown">
          <button onClick={this.toggleDropdown} className="dropbtn">Steve</button>
          <div id="FocusSelectorOptions" className="dropdown-content">
            <a href="#" onClick={this.pickMainFocus}>2016</a>
            <a href="#" onClick={this.pickMainFocus}>2015</a>
            <a href="#" onClick={this.pickMainFocus}>2014</a>
            <a href="#" onClick={this.pickMainFocus}>2013</a>
          </div>
        </div>
      </div>
    )
  }
})

var ZoomSelector = React.createClass({
  render: function(){
    var types = ['minus','plus']
    var that = this
    var buttons = types.map(function(s,i){
      return (
        <li className="zoomButton" key={i}>
          <img width="16" height="16"/>
        </li>
      )
    })
    return (
      <div className="selector">
        <div className="column">
          <ul className="buttonRow">
            {buttons}
          </ul>
        </div>
        <svg className="column"></svg>
      </div>
    )
  }
})

var LayoutSelector = React.createClass({
  render: function(){
    var types = ['rows','grid']
    var that = this
    var buttons = types.map(function(s,i){
      return (
        <li className="layoutButton" key={i}>
          <img width="16" height="16"/>
        </li>
      )
    })
    return (
      <div className="selector">
        <div className="column">
          <ul className="buttonRow">
            {buttons}
          </ul>
        </div>
      </div>
    )
  }
})





var DataPage = React.createClass({
  render: function(){
    
    var className = 'page ' + (this.props.active?'active':'inactive')

    var sections = [
      {'key':1, 'title':'Overview', 'content':
        (<p>Lorem ipsum dolor sit amet</p>)
      },
      {'key':2, 'title':'Explore', 'content':
        (<APIExplorer/>)
      },
      {'key':3, 'title':'Documentation', 'content':
        (<p>Lorem ipsum dolor sit amet</p>)
      }
    ]

    var index = sections.map(function(section){
      return <h3 key={section.key}>{section.key} - {section.title}</h3>
    })

    var content = sections.map(function(section){
      return (
        <div key={section.key}>
          <h2>{section.key} - {section.title}</h2>
          {section.content}
        </div>
      )
    })

    return (
      <div  className={className}  id="dataPage">
        <DataPageIndex>
          {index}
        </DataPageIndex>
        <div id="dataPageContent">
          {content}
        </div>
      </div>
    )
  }
})

var DataPageIndex = React.createClass({
  render: function(){
    return (
      <div id="APIIndex">
        {this.props.children}
      </div>
    )
  }
})

var APIExplorer = React.createClass({
  render: function(){
    return (
      <p>DATA API EXPLORER</p>
    )
  }
})




var AboutPage = React.createClass({
  render: function(){
    var className = 'page ' + (this.props.active?'active':'inactive')
    return (
      <div  className={className}  id="aboutPage">

        <div className="pageWrapper">
          <video></video>
          <div className="columnWrapper">
            <div className="column headline">
              <p>
                120 days, 1,500 miles, 3 countries,<br/>
                2 rivers, 31 adventurers, 100% open data.<br/>
                Join us in real-time as we explore
              </p>
              <h1>
                THE BEATING HEART OF OUR PLANET
              </h1>
            </div>
            <div className="column">
              <p>
                The Okavango Delta is one of the world’s last great wetland wildernesses. Although the Delta has been awarded UNESCO WHS Status its catchments in the highlands of Angola are still unprotected and largely unstudied. Starting in May a team of Ba’Yei, scientists, engineers and adventurers will journey a 1500 miles down the Cuito River, finding new species, exploring new ground, and taking the pulse of this mighty river that brings life-giving water to the Jewel of the Kalahari. 
              </p>
              <p>
                This site displays data which is uploaded daily, via satellite, by the expedition team. Data is also available through a public API, allowing anyone to remix, analyze or visualize the collected information.
              </p>
            </div>
          </div>
          <div className="columnWrapper">
            <div className="column">
            </div>
            <div className="column">
            </div>
          </div>
          <div className="columnWrapper">
            <div className="column">
            </div>
            <div className="column">
            </div>
          </div>
        </div>

      </div>
    )
  }
})

var SharePage = React.createClass({
  render: function(){
    var className = 'page ' + (this.props.active?'active':'inactive')
    return (
      <div  className={className}  id="sharePage">Share page</div>
    )
  }
})
        




////////
////////
////////
////////
////////
////////


var CommentList = React.createClass({
  render: function() {

    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({

  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    var md = new Remarkable();
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});


//

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});


window.onclick = function(event) {
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
}


var render = function(){
  ReactDOM.render(
    // <CommentBox url="/api/comments" pollInterval={2000} />,
    <Okavango/>,
    document.getElementById('okavango')
  );
}

store.subscribe(render)
render()