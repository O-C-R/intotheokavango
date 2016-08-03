
import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const NavigationItem = ({active, onClick, children}) => (
  <li className={active?'active':'inactive'}>
    <Link to={children.toString().toLowerCase()}>{children.toString()}</Link>
  </li>
)

NavigationItem.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default NavigationItem