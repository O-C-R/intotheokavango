
import React, { PropTypes } from 'react'

const NavigationItem = ({active, onClick, children}) => (
  <li className={active?'active':'inactive'} onClick={onClick}>
    <a href="#">{children.toString()}</a>
  </li>
)

NavigationItem.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export default NavigationItem