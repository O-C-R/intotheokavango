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
      <Navigation pathName={location.pathname}/>
      <div id="content" style={height}>
        <LightBox active={false}/>
        <Timeline/>
        <div id="pageContainer">
          {children}
        </div>
      </div>
    </div>
  )
}

Okavango.propTypes = {}
export default Okavango