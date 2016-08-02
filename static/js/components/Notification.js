import React, {PropTypes} from 'react'

const Notification = ({children}) => (
  <div className="notification">
    <div className="content">
      <p>{children.toString()}</p>
    </div>
    <div className="type">
      <img width="16" height="16"/>
    </div>
  </div>
)

Notification.propTypes = {
  children: PropTypes.node.isRequired
}

export default Notification
