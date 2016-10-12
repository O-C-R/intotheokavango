import React, { PropTypes } from 'react'
import BackgroundMap from './BackgroundMap'

import LightBox from './LightBox'
import Timeline from './Timeline'
import Navigation from './Navigation'
import IntroductionBox from './IntroductionBox'

export default class Okavango extends React.Component {
  render () {
    const {children, expedition, animate, updateMap, fetchDay, setControl, jumpTo, isFetching, mapStateNeedsUpdate, setPage, expeditionID, contentActive, enableContent, initialPage} = this.props
    var height = {height: window.innerWidth > 768 ? window.innerHeight - 100 : window.innerHeight - 120}

    return (
      <div id="root">
        <BackgroundMap initialPage={initialPage} expeditionID={expeditionID} isFetching={isFetching} animate={animate} expedition={expedition} updateMap={updateMap} fetchDay={fetchDay} setControl={setControl} mapStateNeedsUpdate={mapStateNeedsUpdate} contentActive={contentActive}/>
        <div id="mapOverlay" style={{display: (location.pathname === '/map' || location.pathname === '/' ? 'block' : 'none')}}></div>
        <div id="nightOverlay" style={{opacity: (location.pathname === '/map' || location.pathname === '/' ? 0 : 1)}}></div>
        <Navigation setPage={setPage} pathName={location.pathname}/>
        <div id="content" style={height} className={contentActive ? '' : 'hidden'}>
          {isFetching ? (
            <div id="loadingWheel">
              <div class="wheel"></div>
            </div>
          ) : null}
          <LightBox active={false}/>
          <Timeline expeditionID={expeditionID} expedition={expedition} jumpTo={jumpTo}/>
          <div id="pageContainer">
            {children}
          </div>
          <div class="logos" style={{display: (location.pathname === '/map' || location.pathname === '/' ? 'block' : 'none')}}>
            <a href="http://www.nationalgeographic.com/">
              <img src="static/img/natgeoLogo.svg" alt="National Geographic Logo" height="35px"/>
            </a>
            <a href="http://conservify.org/">
              <img src="static/img/conservify.png" alt="Conservify Logo" height="35px"/>
            </a>
            <a href="http://www.o-c-r.org/">
              <img src="static/img/ocrLogo.svg" alt="The Office for Creative Research Logo" height="35px"/>
            </a>
            <a href="http://www.wildbirdtrust.com/">
              <img src="static/img/wbtLogo.png" alt="Wild Bird Trust Logo" height="35px"/>
            </a>
          </div>
        </div>
        <IntroductionBox enableContent={enableContent} animate={animate}/>
      </div>
    )
  }
}

Okavango.propTypes = {
  animate: PropTypes.bool,
  children: PropTypes.node.isRequired,
  expedition: PropTypes.object,
  expeditionID: PropTypes.string,
  updateMap: PropTypes.func.isRequired,
  fetchDay: PropTypes.func.isRequired,
  setControl: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  mapStateNeedsUpdate: PropTypes.bool.isRequired,
  setPage: PropTypes.func.isRequired,
  contentActive: PropTypes.bool.isRequired,
  enableContent: PropTypes.func.isRequired,
  initialPage: PropTypes.string.isRequired
}
