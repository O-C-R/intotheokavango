import React, {PropTypes} from 'react'

const Notification = ({children, type}) => (
  <div className="notification">
    <div className="content">
      {children}
    </div>
    <div className="type">
      <img width="16" height="16" src={'static/img/icon-' + type + '.png'}/>
    </div>
  </div>
)

Notification.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired
}

export default Notification
