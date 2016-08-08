
import React, { PropTypes } from 'react'
import MapGL from 'react-map-gl'
import I from 'immutable'
import autobind from 'autobind-decorator'

import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../mapbox-api'

class BackgroundMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      frameCount: 0
    }
  }

  @autobind
  tick () {
    const {animate} = this.props
    if (animate) {
      // if (Math.random() < 0.02) console.log('rendering map')
      // animate
    }
    requestAnimationFrame(this.tick)
  }

  componentDidMount () {
    // const {animate} = this.props
    // this.setState(Object.assign({}, this.getState(), {
    //   killAnimation: false,
    //   frameCount: 0
    // }))
    this.tick()
  }

  componentWillReceiveProps (nextProps) {
    // const {animate} = this.props
    // this.setState(Object.assign({}, this.getState(), {
    //   killAnimation: true
    // }))
  }

  render () {
    return (
      <div id="mapbox">
        <MapGL
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width={window.innerWidth} height={window.innerHeight} latitude={37.7577} longitude={-122.4376}
          zoom={8} onChangeViewport={(viewport) => {
            const {latitude, longitude, zoom} = viewport;
            // Optionally call `setState` and use the state to update the map.
          }}
        />
      </div>
    )
  }
}

BackgroundMap.propTypes = {
  animate: PropTypes.bool.isRequired
}

export default BackgroundMap

