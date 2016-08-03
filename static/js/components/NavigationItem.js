
import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const NavigationItem = ({children, active}) => (
  <li className={active?'active':''}>
    <Link to={children.toString().toLowerCase()}>{children.toString()}</Link>
  </li>
)

NavigationItem.propTypes = {
  children: PropTypes.node.isRequired,
  // active: PropTypes.bool.isRequred
  // pathName: PropTypes.node. 
}

export default NavigationItem