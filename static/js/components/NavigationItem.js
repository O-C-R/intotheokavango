
import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const NavigationItem = ({children, active, setPage, enabled}) => {
  if (!setPage) setPage = () => { return }

  if (!enabled) {
    return (
      <li className={'disabled ' + (active ? 'active' : '')}>
        <span>{children.toString()}</span>
      </li>
    );
  }
  return (
    <li className={active ? 'active' : ''} onClick={setPage}>
      <Link to={children.toString().toLowerCase()}>{children.toString()}</Link>
    </li>
  )
}

NavigationItem.propTypes = {
  children: PropTypes.node.isRequired,
  setPage: PropTypes.func,
  active: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired
}

export default NavigationItem
