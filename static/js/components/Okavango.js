import React, { PropTypes } from 'react'
import BackgroundMap from './BackgroundMap'

import LightBox from './LightBox'
import Timeline from './Timeline'
import Navigation from './Navigation'

export default class Okavango extends React.Component {

  render () {
    const {children, expedition, animate} = this.props
    var height = {height: window.innerHeight - 100}

    return (
      <div id="root">
        <BackgroundMap animate={animate} expedition={expedition}/>
        <Navigation pathName={location.pathname}/>
        <div id="content" style={height}>
          <LightBox active={false}/>
          <Timeline expedition={expedition}/>
          <div id="pageContainer">
            {children}
          </div>
        </div>
      </div>
    )
  }
}

Okavango.propTypes = {
  animate: PropTypes.bool,
  children: PropTypes.node.isRequired,
  expedition: PropTypes.object
}
