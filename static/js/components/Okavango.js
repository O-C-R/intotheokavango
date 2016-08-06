import React, { PropTypes } from 'react'
import MapBox from './MapBox'

import LightBox from './LightBox'
import Timeline from './Timeline'
import Navigation from './Navigation'

const Okavango = ({children, expedition, currentDate}) => {
  var height = {height: window.innerHeight - 100}

  return (
    <div id="root">
      <MapBox/>
      <Navigation pathName={location.pathname}/>
      <div id="content" style={height}>
        <LightBox active={false}/>
        <Timeline currentDate={currentDate} expedition={expedition}/>
        <div id="pageContainer">
          {children}
        </div>
      </div>
    </div>
  )
}

Okavango.propTypes = {
  children: PropTypes.node.isRequired,
  expedition: PropTypes.object.isRequired,
  currentDate: PropTypes.object.isRequired
}

export default Okavango
