
import React, {PropTypes} from 'react'
import ControlPanel from './ControlPanel'
import NotificationPanel from './NotificationPanel'

const MapPage = ({active}) => {

  var notifications = [
    {type:'twitter',content:'lorem ipsum dolor sit amet',key:1},
    {type:'twitter',content:'lorem ipsum dolor sit amet',key:2}
  ]

  var className = 'page ' + (active?'active':'inactive')
  var date = new Date()
  var year = 2016
  return (
    <div className={className} id="mapPage">
      <ControlPanel year={year} date={date} playback focus zoom/>
      <NotificationPanel notifications={notifications}/>
    </div>
  )
}

MapPage.propTypes = {
  active : PropTypes.bool.isRequired
}
export default MapPage
