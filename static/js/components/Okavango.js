import React, { PropTypes } from 'react'
import MapBox from './MapBox'

import LightBox from './LightBox'
import Timeline from './Timeline'
import Navigation from './Navigation'


const Okavango = ({children}) => {

  var height = {height: window.innerHeight-100}

  return (
    <div id="root">
      <MapBox/>
      <Navigation currentPage="map"/>
      <div id="content" style={height}>
        <LightBox active={false}/>
        {children}
      </div>
    </div>
  )
}

Okavango.propTypes = {}
export default Okavango