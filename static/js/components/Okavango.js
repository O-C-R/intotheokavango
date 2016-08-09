import React, { PropTypes } from 'react'
import BackgroundMap from './BackgroundMap'

import LightBox from './LightBox'
import Timeline from './Timeline'
import Navigation from './Navigation'

export default class Okavango extends React.Component {

  render () {
    const {children, expedition, animate, updateTime, fetchDay, setControl, jumpTo, isFetching} = this.props
    var height = {height: window.innerHeight - 100}

    return (
      <div id="root">
        <BackgroundMap animate={animate} expedition={expedition} updateTime={updateTime} fetchDay={fetchDay} setControl={setControl}/>
        <Navigation pathName={location.pathname}/>
        <div id="content" style={height}>
          {isFetching ? <div id="loadingWheel"></div> : null}
          <LightBox active={false}/>
          <Timeline expedition={expedition} jumpTo={jumpTo}/>
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
  expedition: PropTypes.object,
  updateTime: PropTypes.func.isRequired,
  fetchDay: PropTypes.func.isRequired,
  setControl: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
}
