
import React, {PropTypes} from 'react'
import NotificationPanel from './NotificationPanel'
import ControlPanelContainer from '../containers/ControlPanelContainer.js'

const MapPage = () => {


  var notifications = [
    {type:'twitter',content:'lorem ipsum dolor sit amet',key:1},
    {type:'twitter',content:'lorem ipsum dolor sit amet',key:2}
  ]

  var date = new Date()
  var year = 2016
  return (
    <div className='page' id="mapPage">
      <ControlPanelContainer pathName={location.pathname}/>
      <NotificationPanel notifications={notifications}/>
    </div>
  )
}

MapPage.propTypes = {
  // active : PropTypes.bool.isRequired
}
export default MapPage
