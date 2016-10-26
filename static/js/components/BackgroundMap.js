import React, { PropTypes } from 'react'
// import MapGL from 'react-map-gl'
import autobind from 'autobind-decorator'
import * as d3 from 'd3'
import ViewportMercator from 'viewport-mercator-project'
import { lerp, rgb2hex } from '../utils'
// import { Sprite } from 'react-pixi'
import WebGLOverlay from './WebGLOverlay'
import MapGL, { SVGOverlay } from 'react-map-gl'
// import { DeckGLOverlay, ScatterplotLayer } from '../deck.gl'
// import PIXI from 'pixi.js'
import THREE from '../react-three-renderer/node_modules/three'

class BackgroundMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contentActive: false,
      animate: false,
      coordinates: [0, 0],
      viewport: {
        latitude: -18.5699229,
        longitude: 22.115456,
        zoom: 4,
        width: window.innerWidth,
        height: window.innerHeight,
        startDragLngLat: null,
        isDragging: false
      }
    }
  }

  @autobind
  tick (pastFrameDate) {
    const speedFactor = (Date.now() - pastFrameDate) / (1000 / 60)
    const currentFrameDate = Date.now()
    const {expeditionID, animate, expedition, fetchDay, setControl, isFetching, updateMap, initialPage} = this.props
    var b1, b2
    if (animate && !isFetching && location.pathname === '/map' || location.pathname === '/') {
      // increment time
      var dateOffset = 0
      var forward = expedition.playback === 'fastForward' || expedition.playback === 'forward' || expedition.playback === 'pause'
      if (this.state.beaconIndex === (forward ? 0 : 1) || this.state.beaconIndex === (forward ? d3.values(this.state.day.beacons).length - 2 : d3.values(this.state.day.beacons).length - 1)) {
        var offset = this.state.timeToNextBeacon > 0 ? Math.min(100000, this.state.timeToNextBeacon + 1) : 100000
        if (expedition.playback === 'fastBackward' || expedition.playback === 'backward') dateOffset = -1 * offset
        if (expedition.playback === 'forward' || expedition.playback === 'fastForward') dateOffset = offset
      } else {
        if (expedition.playback === 'fastBackward') dateOffset = -25000
        if (expedition.playback === 'backward') dateOffset = -4000
        if (expedition.playback === 'forward') dateOffset = 4000
        if (expedition.playback === 'fastForward') dateOffset = 25000
      }
      var currentDate = new Date(Math.min(expedition.end.getTime() - 1, (Math.max(expedition.start.getTime() + 1, this.state.currentDate.getTime() + dateOffset))))

      // pause playback if time reaches beginning or end
      if ((currentDate.getTime() === expedition.end.getTime() - 1 && (expedition.playback === 'forward' || expedition.playback === 'fastForward')) || (currentDate.getTime() === expedition.start.getTime() + 1 && (expedition.playback === 'backward' || expedition.playback === 'fastBackward'))) setControl('playback', 'pause')

      // checks current day
      var currentDay = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
      if (currentDay !== this.state.currentDay) {
        // new day
        fetchDay(currentDate)
      }

      // look for most current beacon
      const day = expedition.days[currentDay]
      var beacons = d3.values(day.beacons).sort((a, b) => {
        return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime()
      })
      var beaconCount = beacons.length
      var beaconIndex
      var timeToNextBeacon = 0
      var ratioBetweenBeacons = 0
      if (expedition.playback === 'forward' || expedition.playback === 'fastForward' || expedition.playback === 'pause') {
        for (var i = 0; i < beaconCount - 1; i++) {
          b1 = new Date(beacons[i].properties.DateTime).getTime()
          b2 = new Date(beacons[i + 1].properties.DateTime).getTime()
          if (currentDate.getTime() >= b1 && currentDate.getTime() < b2) {
            beaconIndex = i
            timeToNextBeacon = b2 - currentDate.getTime()
            ratioBetweenBeacons = (currentDate.getTime() - b1) / (b2 - b1)
            break
          }
        }
        if (beaconIndex < 0) beaconIndex = beaconCount - 1
      } else {
        for (i = beaconCount - 1; i > 0; i--) {
          b1 = new Date(beacons[i].properties.DateTime).getTime()
          b2 = new Date(beacons[i - 1].properties.DateTime).getTime()
          if (currentDate.getTime() <= b1 && currentDate.getTime() > b2) {
            beaconIndex = i
            timeToNextBeacon = currentDate.getTime() - b2
            ratioBetweenBeacons = (currentDate.getTime() - b1) / (b2 - b1)
            break
          }
        }
        if (beaconIndex < 0) beaconIndex = 0
      }
      // set map coordinates to current beacon
      var currentBeacon = beacons[beaconIndex + (forward ? 0 : 0)]
      var nextBeacon = beacons[beaconIndex + (forward ? 1 : -1)]
      var coordinates = [
        lerp(currentBeacon.geometry.coordinates[0], nextBeacon.geometry.coordinates[0], ratioBetweenBeacons),
        lerp(currentBeacon.geometry.coordinates[1], nextBeacon.geometry.coordinates[1], ratioBetweenBeacons)
      ]

       // look for most current ambit_geo
      const members = { ...expedition.members }
      Object.keys(members).forEach(memberID => {
        var member = members[memberID]
        var ambits = d3.values(expedition.featuresByMember[memberID][currentDay]).sort((a, b) => {
          return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime()
        })
        var ambitCount = ambits.length
        var ambitIndex = -1
        var ratioBetweenAmbits = 0
        if (expedition.playback === 'forward' || expedition.playback === 'fastForward' || expedition.playback === 'pause') {
          for (var i = 0; i < ambitCount - 1; i++) {
            b1 = new Date(ambits[i].properties.DateTime).getTime()
            b2 = new Date(ambits[i + 1].properties.DateTime).getTime()
            if (currentDate.getTime() >= b1 && currentDate.getTime() < b2) {
              ambitIndex = i
              ratioBetweenAmbits = (currentDate.getTime() - b1) / (b2 - b1)
              break
            }
          }
          if (ambitIndex < 0) {
            ambitIndex = ambitCount - 2
            ratioBetweenAmbits = 1
          }
        } else {
          for (i = ambitCount - 1; i > 0; i--) {
            b1 = new Date(ambits[i].properties.DateTime).getTime()
            b2 = new Date(ambits[i - 1].properties.DateTime).getTime()
            if (currentDate.getTime() <= b1 && currentDate.getTime() > b2) {
              ambitIndex = i
              ratioBetweenAmbits = (currentDate.getTime() - b1) / (b2 - b1)
              break
            }
          }
          if (ambitIndex < 0) {
            ambitIndex = 1
            ratioBetweenAmbits = 1
          }
        }
        // set member coordinates
        var currentID = ambitIndex
        var nextID = ambitIndex + (forward ? 1 : -1)
        if (currentID >= 0 && currentID < ambits.length && nextID >= 0 && nextID < ambits.length) {
          var currentAmbits = ambits[currentID]
          var nextAmbit = ambits[nextID]
          member.coordinates = [
            lerp(currentAmbits.geometry.coordinates[0], nextAmbit.geometry.coordinates[0], ratioBetweenAmbits),
            lerp(currentAmbits.geometry.coordinates[1], nextAmbit.geometry.coordinates[1], ratioBetweenAmbits)
          ]
        } else {
          member.coordinates = [-180, 90]
        }
      })

      var zoom = lerp(this.state.viewport.zoom, this.state.viewport.targetZoom, Math.pow(this.state.viewport.zoom / this.state.viewport.targetZoom, 2) / 250 * speedFactor)
      // if (!(initialPage === '/' || initialPage === '/map') || (!this.state.contentActive && this.props.contentActive)) zoom = this.state.viewport.targetZoom
      if (!(initialPage === '/' || initialPage === '/map')) zoom = this.state.viewport.targetZoom

      this.setState({
        currentDate,
        animate,
        currentDay,
        day,
        beaconIndex,
        timeToNextBeacon,
        members,
        contentActive: this.props.contentActive,
        viewport: {
          ...this.state.viewport,
          longitude: coordinates[0],
          latitude: coordinates[1],
          zoom: zoom
        }
      })

      if (this.state.frameCount % 60 === 0) {
        const { unproject } = ViewportMercator({ ...this.state.viewport })
        const nw = unproject([0, 0])
        const se = unproject([window.innerWidth, window.innerHeight])
        const viewGeoBounds = [nw[0], nw[1], se[0], se[1]]
        updateMap(this.state.currentDate, [this.state.viewport.longitude, this.state.viewport.latitude], viewGeoBounds, this.state.viewport.zoom, expeditionID)
      }
    }
    this.state.animate = animate
    this.state.frameCount++
    requestAnimationFrame(() => { this.tick(currentFrameDate) })
  }

  componentWillReceiveProps (nextProps) {
    const {animate, expedition, mapStateNeedsUpdate} = nextProps
    // console.log('new', animate, this.state.animate)
    if (animate) {
      const currentDate = expedition.currentDate
      // note: currentDay has a 1 day offset with API expeditionDay, which starts at 1
      const currentDay = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
      const day = expedition.days[currentDay]

      if (mapStateNeedsUpdate) {
        this.state.currentDate = currentDate
        this.state.currentDay = currentDay
        this.state.day = day
        this.state.frameCount = 0
      }

      if (!this.state.animate) {
        this.state.animate = animate
        this.state.viewport = {
          ...this.state.viewport,
          zoom: expedition.initialZoom,
          targetZoom: expedition.targetZoom
        }
        // console.log('starting animation')
        this.tick(Math.round(Date.now() - (1000 / 60)))
      }
    }
  }

  @autobind
  redrawSVGOverlay ({ project }) {
    const { expedition } = this.props
    return (
      <g>
        <g>
          {this.drawAmbits(project)}
        </g>
        <g>
          {this.drawMembers(project)}
        </g>
        {/*
        <g>
          {this.drawPosts(project)}
        </g>
      */}
      </g>
    )
  }

  @autobind
  drawPosts (project) {
    return '' // TRIMMING
    const { expedition } = this.props
    // console.log(expedition.currentPosts.length)
    const icons = expedition.currentPosts.map(post => {
      const translate = (position) => {
        var coords = project(position)
        var x = Math.round(coords[0])
        var y = Math.round(coords[1])
        return 'translate(' + x + ',' + y + ')'
      }
      return (
        <g transform={ translate(post.position) } key={post.id}>
          <image xlinkHref={'/static/img/icon-map-' + post.type + '.png'} x={-12} y={-24} height={31} width={24} />
        </g>
      )
    })
    return icons
  }

  @autobind
  drawMembers (project) {
    const { members } = this.state
    // if (this.state.frameCount % 60 === 0) console.log(members)
    if (!members || members.length === 0) return ''
    const markers = Object.keys(members).map(memberID => {
      var member = members[memberID]
      const translate = (member) => {
        var coords = project(member.coordinates)
        var x = Math.round((coords[0] - 27 / 2) * 10) / 10
        var y = Math.round((coords[1] - 34) * 10) / 10
        return 'translate(' + x + ',' + y + ')'
      }
      return (
        <g transform={ translate(member) } key={memberID}>
          <path fill="rgba(4,0,26,0.7)" d="M27,13.8C27,22.2,13.5,34,13.5,34S0,22.2,0,13.8C0,6.3,6,0.3,13.5,0.3S27,6.3,27,13.8z"/>
          <text style={{textAnchor: 'middle'}} x={13.5} y={19} fill={'white'} >{memberID.slice(0, 1).toUpperCase()}</text>
        </g>
      )
    })
    return markers
  }

  @autobind
  drawAmbits (project) {
    const { expedition } = this.props
    const paths = expedition.currentAmbits.map((route, index) => {
      const points = route.coordinates.map(project).map(
        p => [p[0], p[1]]
      )
      return (
        <g key={ index }>
          <g style={ {pointerEvents: 'click', cursor: 'pointer'} }>
            <g style={ {pointerEvents: 'visibleStroke'} }>
              <path
                style={{
                  fill: 'none',
                  stroke: route.color,
                  strokeWidth: 2
                }}
                d={ `M${points.join('L')}`}
              />
            </g>
          </g>
        </g>
      )
    })
    return paths
  }

  // @autobind
  // onChangeViewport (newViewport) {
  //   newViewport.width = window.innerWidth
  //   newViewport.height = window.innerHeight
  //   this.setState({
  //     ...this.state,
  //     viewport: newViewport
  //   })
  // }

  @autobind
  redrawGLOverlay ({ project } ) {
    return (geometries) => {
      const { expedition } = this.props
      const { currentGeoBounds } = expedition
      const west = currentGeoBounds[0] + (currentGeoBounds[0] - currentGeoBounds[2]) * 0.25
      const north = currentGeoBounds[1] + (currentGeoBounds[1] - currentGeoBounds[3]) * 0.25
      const east = currentGeoBounds[2] + (currentGeoBounds[2] - currentGeoBounds[0]) * 0.25
      const south = currentGeoBounds[3] + (currentGeoBounds[3] - currentGeoBounds[1]) * 0.25
      const gb = [west, north, east, south]

      if (expedition.zoom < 14) {
        return geometries
      } else {
        return {
          ...geometries,
          sightings: this.renderSightings(geometries.sightings, project, expedition, gb),
          pictures360: this.render360Images(geometries.pictures360, project, expedition, gb)
        }
      }
    }
  }

  @autobind
  render360Images (particleGeometry, project, expedition, gb) {

    const images = expedition.current360Images
      .filter(image => {
        const coords = image.geometry.coordinates
        return coords[0] >= gb[0] && coords[0] < gb[2] && coords[1] >= gb[3] && coords[1] < gb[1]
      })

    for (var i = 0; i < particleGeometry.count; i++) {
      const image = images[i]
      if (image) {
        const coords = project([image.geometry.coordinates[0], image.geometry.coordinates[1]])
        particleGeometry.position.array[i * 3 + 0] = coords[0]
        particleGeometry.position.array[i * 3 + 1] = coords[1]
        particleGeometry.position.array[i * 3 + 2] = 0
        particleGeometry.color.array[i * 4 + 0] = 0.62
        particleGeometry.color.array[i * 4 + 1] = 0.6
        particleGeometry.color.array[i * 4 + 2] = 0.7
        particleGeometry.color.array[i * 4 + 3] = 1
      } else {
        particleGeometry.position.array[i * 3 + 0] = 0
        particleGeometry.position.array[i * 3 + 1] = 0
        particleGeometry.position.array[i * 3 + 2] = 0
        particleGeometry.color.array[i * 4 + 0] = 0
        particleGeometry.color.array[i * 4 + 1] = 0
        particleGeometry.color.array[i * 4 + 2] = 0
        particleGeometry.color.array[i * 4 + 3] = 0
      }
    }

    particleGeometry.position.needsUpdate = true
    particleGeometry.color.needsUpdate = true
    particleGeometry.data = images
    return particleGeometry
  }

  @autobind
  renderSightings (particleGeometry, project, expedition, gb) {
    const sightings = expedition.currentSightings
      .filter((sighting, i) => {
        const { position } = sighting
        return position.x >= gb[0] && position.x < gb[2] && position.y >= gb[3] && position.y < gb[1]
      })

    for (var i = 0; i < particleGeometry.count; i++) {
      const sighting = sightings[i]
      if (sighting) {
        const { position, radius } = sighting
        const coords = project([position.x, position.y])
        const color = new THREE.Color(sighting.color)
        particleGeometry.position.array[i * 3 + 0] = coords[0]
        particleGeometry.position.array[i * 3 + 1] = coords[1]
        particleGeometry.position.array[i * 3 + 2] = radius * 2
        particleGeometry.color.array[i * 4 + 0] = color.r
        particleGeometry.color.array[i * 4 + 1] = color.g
        particleGeometry.color.array[i * 4 + 2] = color.b
        particleGeometry.color.array[i * 4 + 3] = 1
      } else {
        particleGeometry.position.array[i * 3 + 0] = 0
        particleGeometry.position.array[i * 3 + 1] = 0
        particleGeometry.position.array[i * 3 + 2] = 0
        particleGeometry.color.array[i * 4 + 0] = 0
        particleGeometry.color.array[i * 4 + 1] = 0
        particleGeometry.color.array[i * 4 + 2] = 0
        particleGeometry.color.array[i * 4 + 3] = 0
      }
    }

    particleGeometry.position.needsUpdate = true
    particleGeometry.color.needsUpdate = true
    particleGeometry.data = sightings
    return particleGeometry
  }

  @autobind
  renderAmbits (children, project, expedition, gb) {

    // return children.concat(expedition.currentAmbits
    //   .map((route, i) => {
    //     return route.coordinates
    //       .filter((point, j) => {
    //         return point[0] >= gb[0] && point[0] < gb[2] && point[1] >= gb[3] && point[1] < gb[1]
    //       })
    //       .map(project)
    //       .map(point => [point[0], point[1]])
    //       .map(point => {
            
    //       })
    //     // return member.filter((sighting, i) => {
    //     //   const { position } = sighting
    //     //   return position.x >= gb[0] && position.x < gb[2] && position.y >= gb[3] && position.y < gb[1]
    //     // })
    //     // .map((sighting, i) => {
    //     //   const { position, color, radius } = sighting
    //     //   const coords = project([position.x, position.y])
    //     //   return <Sprite image={'static/img/sighting.png'} x={coords[0]} y={coords[1]} width={radius * 2} height={radius * 2} key={i} tint={color} />
    //     // }))
        
    //   })

    // return children.concat(expedition.currentAmbits)

    // const paths = expedition.currentAmbits.map((route, index) => {
    //   const points = route.coordinates.map(project).map(
    //     p => [p[0], p[1]]
    //   )
    //   return (
    //     <g key={ index }>
    //       <g style={ {pointerEvents: 'click', cursor: 'pointer'} }>
    //         <g style={ {pointerEvents: 'visibleStroke'} }>
    //           <path
    //             style={{
    //               fill: 'none',
    //               stroke: route.color,
    //               strokeWidth: 2
    //             }}
    //             d={ `M${points.join('L')}`}
    //           />
    //         </g>
    //       </g>
    //     </g>
    //   )
    // })

    return children
  }

  render () {
    const { expedition, show360Picture, lightBoxActive } = this.props
    const { viewport, currentDate } = this.state
    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaWFhYWFuIiwiYSI6ImNpbXF1ZW4xOTAwbnl3Ymx1Y2J6Mm5xOHYifQ.6wlNzSdcTlonLBH-xcmUdQ'
    const MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-v9?format=jpg70'

    return (
      <div id="mapbox" style={{zIndex: (!lightBoxActive && (location.pathname === '/map' || location.pathname === '/') ? 0 : -100)}}>
        <MapGL
          {...viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          {expedition
          ? <div>
            {/*
            <SVGOverlay
              {...viewport}
              startDragLngLat={[0, 0]}
              redraw={ this.redrawSVGOverlay }
            />
            */}
            {/*
            <PIXIStage width={window.innerWidth} height={window.innerHeight}>
              { this.redrawSightings }
            </PIXIStage>;

            <WebGLOverlay
              {...mapStateProps}
              {...{ width, height, latitude, longitude, zoom, simulationTime }}
              redraw={redrawWebGL(longitude, latitude, heading, zoom, simulationTime)}
            />
            */}

            <WebGLOverlay
              {...viewport}
              startDragLngLat={[0, 0]}
              redraw={this.redrawGLOverlay}
              show360Picture={show360Picture}
              currentDate={currentDate}
            />
            {/*
            <DeckGLOverlay
              {...viewport}
              startDragLngLat={[0, 0]}
              layers={[
                new ScatterplotLayer({
                  ...viewport,
                  id: 'sightings',
                  data: expedition.currentSightings
                })
              ]}
            />
            */}

          </div>
          : ''}
        </MapGL>
      </div>
    )
  }
}

BackgroundMap.propTypes = {
  animate: PropTypes.bool.isRequired,
  expedition: PropTypes.object,
  updateMap: PropTypes.func.isRequired,
  fetchDay: PropTypes.func.isRequired,
  setControl: PropTypes.func.isRequired,
  mapStateNeedsUpdate: PropTypes.bool.isRequired,
  initialPage: PropTypes.string.isRequired,
  contentActive: PropTypes.bool,
  show360Picture: PropTypes.func.isRequired,
  lightBoxActive: PropTypes.bool.isRequired
}

export default BackgroundMap
