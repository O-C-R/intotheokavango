
import React, {PropTypes} from 'react'

const SharePage = ({active}) => {
  var className = 'page ' + (active?'active':'inactive')
  return (
    <div  className={className}  id="sharePage">Share page</div>
  )
}

SharePage.propTypes = {
  active: PropTypes.bool.isRequired
}

export default SharePage