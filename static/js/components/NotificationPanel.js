
import React, {PropTypes} from 'react'
import Notification from './Notification'

const NotificationPanel = ({notifications}) => {
  var notificationItems = notifications.map(function(notification) {
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

NotificationPanel.propTypes = {
  notifications: PropTypes.array.isRequired
}

export default NotificationPanel
