import React, { PropTypes } from 'react'
import BackgroundMap from './BackgroundMap'

import LightBox from './LightBox'
import Timeline from './Timeline'
import Navigation from './Navigation'

export default class Okavango extends React.Component {

  componentWillReceiveProps (nextProps) {
    const { setControl } = this.props
    if (location.pathname !== 'map') setControl('playback', 'pause')
  }

  render () {
    const {children, expedition, animate, updateMap, fetchDay, setControl, jumpTo, isFetching, mapStateNeedsUpdate} = this.props
    var height = {height: window.innerHeight - 100}

    // const nightOpacity = () => {
    //   console.log('opacity')
    //   if (!expedition) return { opacity: 0 }
    //   var currentDate = expedition.currentDate.getTime() + 2 * (1000 * 3600)
    //   var currentTime = currentDate % (1000 * 3600 * 24)
    //   var opacity = Math.floor(currentTime / (1000 * 3600 * 24) * 100)
    //   console.log('opacity', opacity)
    //   return {
    //     { opacity: opacity + '%' }
    //   }
    // }

    return (
      <div id="root">
        <BackgroundMap isFetching={isFetching} animate={animate} expedition={expedition} updateMap={updateMap} fetchDay={fetchDay} setControl={setControl} mapStateNeedsUpdate={mapStateNeedsUpdate}/>
        <div id="mapOverlay" style={{display: (location.pathname === '/map' || location.pathname === '/' ? 'block' : 'none')}}></div>
        <div id="nightOverlay" style={{opacity: (location.pathname === '/map' || location.pathname === '/' ? 0 : 1)}}></div>
        <Navigation pathName={location.pathname}/>
        <div id="content" style={height}>
          {isFetching ?
          <div id="loadingWheel">
            <div class="wheel"></div>
          </div> : null}
          <LightBox active={false}/>
          <Timeline expedition={expedition} jumpTo={jumpTo}/>
          <div id="pageContainer">
            {children}
          </div>
          <div class="logos" style={{display: (location.pathname === '/map' || location.pathname === '/' ? 'block' : 'none')}}>
            <a href="http://www.nationalgeographic.com/">
              <img src="static/img/natgeoLogo.svg" alt="National Geographic Logo" height="35px"/>
            </a>
            <a href="http://www.o-c-r.org/">
              <img src="static/img/ocrLogo.svg" alt="The Office for Creative Research Logo" height="35px"/>
            </a>
            <a href="http://www.wildbirdtrust.com/">
              <img src="static/img/wbtLogo.png" alt="Wild Bird Trust Logo" height="35px"/>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

Okavango.propTypes = {
  animate: PropTypes.bool,
  children: PropTypes.node.isRequired,
  expedition: PropTypes.object,
  updateMap: PropTypes.func.isRequired,
  fetchDay: PropTypes.func.isRequired,
  setControl: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  mapStateNeedsUpdate: PropTypes.bool.isRequired
}
