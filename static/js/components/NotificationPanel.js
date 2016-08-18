
import React, {PropTypes} from 'react'
import Notification from './Notification'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const NotificationPanel = ({posts, currentDate}) => {

  var start
  var end
  if (currentDate) {
    start = new Date(currentDate.getTime() - 0.5 * (1000 * 3600))
    end = new Date(currentDate.getTime() + 0.5 * (1000 * 3600))
  }

  if (!posts) posts = []
  var notificationItems = posts
    .filter(post => {
      var d = new Date(post.properties.DateTime)
      return d.getTime() >= start && d.getTime() < end
    })

  notificationItems = notificationItems
    .filter((post, i) => {
      return window.innerWidth > 768 || i === notificationItems.length - 1
    })
    .sort((a, b) => {
      return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime()
    })
    .map((post, i) => {
      switch (post.type) {
        case 'tweet':
          var text = post.properties.Text
          text = text.split(' ').slice(0, text.split(' ').length - 1).join(' ')
          if (post.properties.Tweet) text = post.properties.Tweet.text
          var images = post.properties.Images
            .filter((img, j) => {
              return j === 0
            })
            .map((img, j) => {
              return <img src={img.Url} width="100%" key={j}/>
            })
          return (
            <Notification type={post.type} key={post.id}>
              <p style={{position:window.innerWidth > 768 || post.properties.Images.length === 0 ? 'relative' : 'absolute'}}>{text}</p>
              <div className="images">{images}</div>
            </Notification>
          )
        case 'audio':
          return (
            <Notification type={post.type} key={post.id}>
              <div className="title">{post.properties.Title}</div>
            </Notification>
          )
        case 'blog':
          return (
            <Notification type={post.type} key={post.id}>
              <div className="title">{post.properties.Title}</div>
            </Notification>
          )
        case 'image':
          var width = 0
          var height = 0
          if (post.properties.Dimensions) {
            width = post.properties.Dimensions[0]
            height = post.properties.Dimensions[1]
          } else if (post.properties.Size) {
            width = post.properties.Size[0]
            height = post.properties.Size[1]
          }
          return (
            <Notification type={post.type} key={post.id} >
              <img className="image" src={post.properties.Url} width={width} height={height}/>
            </Notification>
          )
      }
    })

  var height = window.innerWidth > 768 ? {height: window.innerWidth - 100} : {}

  return (
    <div id="notificationPanel" style={height}>
      <ReactCSSTransitionGroup transitionName="notif" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
      {notificationItems}
      </ReactCSSTransitionGroup>
    </div>
  )
}

NotificationPanel.propTypes = {
  posts: PropTypes.array,
  currentDate: PropTypes.object
}

export default NotificationPanel
