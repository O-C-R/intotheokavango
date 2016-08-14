
import React, {PropTypes} from 'react'
import Notification from './Notification'

const NotificationPanel = ({posts, currentDate}) => {

  var start
  var end
  if (currentDate) {
    start = new Date(currentDate.getTime() - 0.5 * (1000 * 3600))
    end = new Date(currentDate.getTime() + 0.5 * (1000 * 3600))
  }

  if (!posts) posts = []
  const notificationItems = posts
    .filter(post => {
      var d = new Date(post.properties.DateTime)
      return d.getTime() >= start && d.getTime() < end
    })
    .sort((a, b) => {
      return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime()
    })
    .map((post, i) => {
      switch (post.type) {
        case 'tweet':
          console.log('aga!', post.properties)
          var text = post.properties.Text
          if (post.properties.Tweet) text = post.properties.Tweet.text
          return (
            <Notification type={post.type} key={i}>
              <p>{text}</p>
              <div className="images">{post.properties.Images}</div>
            </Notification>
          )
        case 'audio':
          return (
            <Notification type={post.type} key={i}>
              <div className="title">{post.properties.Title}</div>
            </Notification>
          )
        case 'blog':
          return (
            <Notification type={post.type} key={i}>
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
            <Notification type={post.type} key={i} >
              <img className="image" src={post.properties.Url} width={width} height={height}/>
            </Notification>
          )
      }
    })
  return (
    <div id="notificationPanel">
      {notificationItems}
    </div>
  )
}

NotificationPanel.propTypes = {
  posts: PropTypes.array,
  currentDate: PropTypes.object
}

export default NotificationPanel
