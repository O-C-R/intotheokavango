
import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const NavigationItem = ({children, active, setPage}) => {
  if (!setPage) setPage = () => { return }
  return (
    <li className={active ? 'active' : ''} onClick={setPage}>
      <Link to={children.toString().toLowerCase()}>{children.toString()}</Link>
    </li>
  )
}

NavigationItem.propTypes = {
  children: PropTypes.node.isRequired,
  setPage: PropTypes.func
  // active: PropTypes.bool.isRequred
  // pathName: PropTypes.node.
}

export default NavigationItem
