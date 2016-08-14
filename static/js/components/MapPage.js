
// import React, { PropTypes } from 'react'
import React from 'react'
import NotificationPanelContainer from '../containers/NotificationPanelContainer'
import ControlPanelContainer from '../containers/ControlPanelContainer.js'

const MapPage = () => {
  return (
    <div className='page' id="mapPage">
      <ControlPanelContainer pathName={location.pathname}/>
      <NotificationPanelContainer/>
    </div>
  )
}

// MapPage.propTypes = {
//   active : PropTypes.bool.isRequired
// }
export default MapPage
