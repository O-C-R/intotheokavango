import React, { PropTypes } from 'react'
import autobind from 'autobind-decorator'
import * as d3 from 'd3'
import ViewportMercator from 'viewport-mercator-project'
import { lerp, parseDate } from '../utils'
import WebGLOverlay from './WebGLOverlay'
import MapGL from 'react-map-gl'
import * as THREE from 'three'

class BackgroundMap extends React.Component {
  constructor (props) {
    super(props);
    this.simpleState = {
      frameCount: 0,
      contentActive: false,
      animate: false,
      sortedBeacons: null,
      sortedAmbits: {},
      coordinates: [0, 0],
      viewport: {
        latitude: -12.7373785,
        longitude: 15.8180427,
        zoom: 4,
        width: window.innerWidth,
        height: window.innerHeight,
        startDragLngLat: null,
        isDragging: false
      }
    }
    this.prevState = {...this.simpleState};
  }

  @autobind
  tick (pastFrameDate) {
    let newState = {};
    const speedFactor = (Date.now() - pastFrameDate) / (1000 / 60);
    const currentFrameDate = Date.now();

    if (currentFrameDate - pastFrameDate < 33) {
      requestAnimationFrame(() => { this.tick(pastFrameDate) })
      return;
    }

    const {expeditionID, animate, expedition, fetchDay, setControl, isFetching, updateMap} = this.props;
    let b1, b2;
    if (animate && !isFetching && (location.pathname === '/map' || location.pathname === '/')) {
      // increment time
      let dateOffset = 0;
      let forward = expedition.playback === 'fastForward' || expedition.playback === 'forward' || expedition.playback === 'pause';
      if (this.simpleState.beaconIndex === (forward ? 0 : 1) || this.simpleState.beaconIndex === (forward ? d3.values(this.simpleState.day.beacons).length - 2 : d3.values(this.simpleState.day.beacons).length - 1)) {
        let offset = this.simpleState.timeToNextBeacon > 0 ? Math.min(100000, this.simpleState.timeToNextBeacon + 1) : 100000;
        if (expedition.playback === 'fastBackward' || expedition.playback === 'backward') dateOffset = -1 * offset;
        if (expedition.playback === 'forward' || expedition.playback === 'fastForward') dateOffset = offset
      } else {
        if (expedition.playback === 'fastBackward') dateOffset = -25000;
        if (expedition.playback === 'backward') dateOffset = -4000;
        if (expedition.playback === 'forward') dateOffset = 4000;
        if (expedition.playback === 'fastForward') dateOffset = 25000
      }
      let currentDate = new Date(Math.min(expedition.end.getTime() - 1, (Math.max(expedition.start.getTime() + 1, this.simpleState.currentDate.getTime() + dateOffset))));

      // pause playback if time reaches beginning or end
      if ((currentDate.getTime() === expedition.end.getTime() - 1 && (expedition.playback === 'forward' || expedition.playback === 'fastForward')) || (currentDate.getTime() === expedition.start.getTime() + 1 && (expedition.playback === 'backward' || expedition.playback === 'fastBackward'))) setControl('playback', 'pause');

      // checks current day
      let currentDay = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
      if (currentDay !== this.simpleState.currentDay) {
        // new day
        this.simpleState.sortedBeacons = null;
        this.simpleState.sortedAmbits = {};
        fetchDay(currentDate)
      }
      // look for most current beacon
      const day = expedition.days[currentDay];

      // TODO: fix SORT

      if (!this.simpleState.sortedBeacons) {
        this.simpleState.sortedBeacons = d3.values(day.beacons)
          .sort((a, b) => {
            return parseDate(a.properties.DateTime).getTime() - parseDate(b.properties.DateTime).getTime()
          });
      }
      let beacons = this.simpleState.sortedBeacons;
      let beaconCount = beacons.length;
      let beaconIndex;
      let timeToNextBeacon = 0;
      let ratioBetweenBeacons = 0;
      if (expedition.playback === 'forward' || expedition.playback === 'fastForward' || expedition.playback === 'pause') {
        for (let i = 0; i < beaconCount - 1; i++) {
          b1 = parseDate(beacons[i].properties.DateTime).getTime();
          b2 = parseDate(beacons[i + 1].properties.DateTime).getTime();
          if (currentDate.getTime() >= b1 && currentDate.getTime() < b2) {
            beaconIndex = i;
            timeToNextBeacon = b2 - currentDate.getTime();
            ratioBetweenBeacons = (currentDate.getTime() - b1) / (b2 - b1);
            break
          }
        }
        if (beaconIndex < 0) beaconIndex = beaconCount - 1
      } else {
        for (let i = beaconCount - 1; i > 0; i--) {
          b1 = parseDate(beacons[i].properties.DateTime).getTime();
          b2 = parseDate(beacons[i - 1].properties.DateTime).getTime();
          if (currentDate.getTime() <= b1 && currentDate.getTime() > b2) {
            beaconIndex = i;
            timeToNextBeacon = currentDate.getTime() - b2;
            ratioBetweenBeacons = (currentDate.getTime() - b1) / (b2 - b1);
            break
          }
        }
        if (beaconIndex < 0) beaconIndex = 0
      }
      // set map coordinates to current beacon
      let currentBeacon = beacons[beaconIndex + (forward ? 0 : 0)];
      let nextBeacon = beacons[beaconIndex + (forward ? 1 : -1)];

      // Something went wrong with the cache, bail out
      if (!currentBeacon || !nextBeacon) {
        this.simpleState.sortedBeacons = null;
        this.simpleState.sortedAmbits = {};
        requestAnimationFrame(() => { this.tick(currentFrameDate) });
        return;
      }

      let coordinates = [
        lerp(currentBeacon.geometry.coordinates[0], nextBeacon.geometry.coordinates[0], ratioBetweenBeacons),
        lerp(currentBeacon.geometry.coordinates[1], nextBeacon.geometry.coordinates[1], ratioBetweenBeacons)
      ];

       // look for most current ambit_geo
      const members = { ...expedition.members };
      Object.keys(members).forEach(memberID => {
        let member = members[memberID];

        // TODO: fix SORT
        if (!this.simpleState.sortedAmbits[memberID]) {
          this.simpleState.sortedAmbits[memberID] = {};
        }

        if (!this.simpleState.sortedAmbits[memberID][currentDay]) {
          this.simpleState.sortedAmbits[memberID][currentDay] = d3.values(expedition.featuresByMember[memberID][currentDay])
            .sort((a, b) => {
              return parseDate(a.properties.DateTime).getTime() - parseDate(b.properties.DateTime).getTime()
            });
        }
        let ambits = this.simpleState.sortedAmbits[memberID][currentDay];

        let ambitCount = ambits.length;
        let ambitIndex = -1;
        let ratioBetweenAmbits = 0;
        if (expedition.playback === 'forward' || expedition.playback === 'fastForward' || expedition.playback === 'pause') {
          for (let i = 0; i < ambitCount - 1; i++) {
            b1 = parseDate(ambits[i].properties.DateTime).getTime();
            b2 = parseDate(ambits[i + 1].properties.DateTime).getTime();
            if (currentDate.getTime() >= b1 && currentDate.getTime() < b2) {
              ambitIndex = i;
              ratioBetweenAmbits = (currentDate.getTime() - b1) / (b2 - b1);
              break
            }
          }
          if (ambitIndex < 0) {
            ambitIndex = ambitCount - 2;
            ratioBetweenAmbits = 1
          }
        } else {
          for (let i = ambitCount - 1; i > 0; i--) {
            b1 = parseDate(ambits[i].properties.DateTime).getTime();
            b2 = parseDate(ambits[i - 1].properties.DateTime).getTime();
            if (currentDate.getTime() <= b1 && currentDate.getTime() > b2) {
              ambitIndex = i;
              ratioBetweenAmbits = (currentDate.getTime() - b1) / (b2 - b1);
              break
            }
          }
          if (ambitIndex < 0) {
            ambitIndex = 1;
            ratioBetweenAmbits = 1
          }
        }
        // set member coordinates
        let currentID = ambitIndex;
        let nextID = ambitIndex + (forward ? 1 : -1);
        if (currentID >= 0 && currentID < ambits.length && nextID >= 0 && nextID < ambits.length) {
          let currentAmbits = ambits[currentID];
          let nextAmbit = ambits[nextID];

          // Something went wrong with the cache, bail out
          if (!currentAmbits || !nextAmbit) {
            this.simpleState.sortedBeacons = null;
            this.simpleState.sortedAmbits = {};
            requestAnimationFrame(() => { this.tick(currentFrameDate) });
            return;
          }

          member.coordinates = [
            lerp(currentAmbits.geometry.coordinates[0], nextAmbit.geometry.coordinates[0], ratioBetweenAmbits),
            lerp(currentAmbits.geometry.coordinates[1], nextAmbit.geometry.coordinates[1], ratioBetweenAmbits)
          ]
        } else {
          member.coordinates = [-180, 90]
        }
      });

      let zoom = lerp(this.simpleState.viewport.zoom, this.simpleState.viewport.targetZoom, Math.pow(this.simpleState.viewport.zoom / this.simpleState.viewport.targetZoom, 2) / 250 * speedFactor);

      newState = {
        ...newState,
        currentDate,
        animate,
        currentDay,
        day,
        beaconIndex,
        timeToNextBeacon,
        members,
        contentActive: this.props.contentActive,
        viewport: {
          ...this.simpleState.viewport,
          longitude: coordinates[0],
          latitude: coordinates[1],
          zoom: zoom
        }
      };

      if (this.simpleState.frameCount % 60 === 0) {
        const { unproject } = ViewportMercator({ ...this.simpleState.viewport });
        const nw = unproject([0, 0]);
        const se = unproject([window.innerWidth, window.innerHeight]);
        const viewGeoBounds = [nw[0], nw[1], se[0], se[1]];
        updateMap(this.simpleState.currentDate, [this.simpleState.viewport.longitude, this.simpleState.viewport.latitude], viewGeoBounds, this.simpleState.viewport.zoom, expeditionID)
      }
    }

    this.prevState = this.simpleState;

    this.simpleState = {
      ...this.simpleState,
      ...newState,
      animate,
      frameCount: this.simpleState.frameCount + 1
    };

    if (this.simpleState.frameCount % 60 !== 0) { // don't force update is map has been updated
      this.forceUpdate();
    }

    requestAnimationFrame(() => { this.tick(currentFrameDate) })
  }

  shouldComponentUpdate (_1, _2) {
    return !!(
      this.props.expedition &&
      this.props.expedition.playback !== 'pause' &&
      this.simpleState.frameCount !== this.prevState.frameCount
    )
  }

  componentWillReceiveProps (nextProps) {
    const {animate, expedition, mapStateNeedsUpdate} = nextProps;
    // console.log('new', animate, this.simpleState.animate)
    if (animate) {
      const currentDate = expedition.currentDate;
      // note: currentDay has a 1 day offset with API expeditionDay, which starts at 1
      const currentDay = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
      const day = expedition.days[currentDay];

      if (mapStateNeedsUpdate) {
        this.simpleState.currentDate = currentDate;
        this.simpleState.currentDay = currentDay;
        this.simpleState.day = day;
        this.simpleState.frameCount = 0
      }

      if (!this.simpleState.animate) {
        this.simpleState.animate = animate;
        this.simpleState.viewport = {
          ...this.simpleState.viewport,
          zoom: expedition.initialZoom,
          targetZoom: expedition.targetZoom
        };
        // console.log('starting animation')
        this.tick(Math.round(Date.now() - (1000 / 60)))
      }
    }
  }

  @autobind
  redrawGLOverlay ({ unproject }) {
    const screenBounds = [[0, 0], [window.innerWidth, window.innerHeight]].map(unproject);
    return (particles, paths) => {
      const { expedition } = this.props;
      const { currentGeoBounds } = expedition;
      const west = currentGeoBounds[0] + (currentGeoBounds[0] - currentGeoBounds[2]) * 0.25;
      const north = currentGeoBounds[1] + (currentGeoBounds[1] - currentGeoBounds[3]) * 0.25;
      const east = currentGeoBounds[2] + (currentGeoBounds[2] - currentGeoBounds[0]) * 0.25;
      const south = currentGeoBounds[3] + (currentGeoBounds[3] - currentGeoBounds[1]) * 0.25;
      const gb = [west, north, east, south];

      if (expedition.zoom < 10) {
        return {
          particles,
          paths
        }
      } else {
        return {
          particles: {
            ...particles,
            // pictures360: this.render360Images(particles.pictures360, screenBounds, expedition, gb),
            sightings: this.renderSightings(particles.sightings, screenBounds, expedition, gb),
            members: this.renderMembers(particles.members, screenBounds, expedition, gb)
          },
          paths: {
            ambitGeo: this.renderAmbitGeo(paths.ambitGeo, screenBounds, expedition, gb)
          }
        }
      }
    }
  }

  @autobind
  mapToScreen (p, screenBounds) {
    const offset = 0;
    return [
      offset + (window.innerWidth - offset) * ((p[0] - screenBounds[0][0]) / (screenBounds[1][0] - screenBounds[0][0])),
      offset + (window.innerHeight - offset) * ((p[1] - screenBounds[0][1]) / (screenBounds[1][1] - screenBounds[0][1]))
    ]
  }

  @autobind
  renderAmbitGeo (pathGeometry, screenBounds, expedition, gb) {
    const checkGeoBounds = (p, gb) => {
      return p[0] >= gb[0] && p[0] < gb[2] && p[1] >= gb[3] && p[1] < gb[1]
    };

    return expedition.currentAmbits.map(route => {
      const vertices = route.coordinates
        .filter((p, i) => {
          if (route.coordinates[i - 1] && checkGeoBounds(route.coordinates[i - 1], gb)) return true;
          if (checkGeoBounds(route.coordinates[i], gb)) return true;
          return (route.coordinates[i + 1] && checkGeoBounds(route.coordinates[i + 1], gb));
        })
        .map(p => {
          return this.mapToScreen(p, screenBounds)
        })
        .map((p, _i) => {
          return new THREE.Vector3(p[0], p[1], 0)
        });

      if (vertices.length > 0) {
        let lastVertex = vertices[vertices.length - 1].clone();
        if (lastVertex) {
          for (let i = vertices.length; i < 1000; i++) {
            vertices[i] = lastVertex
          }
        }
      }

      return {
        color: route.color,
        vertices
      }
    })
  }

  @autobind
  render360Images (particleGeometry, screenBounds, expedition, gb) {
    const images = expedition.current360Images
      .filter(image => {
        const coords = image.geometry.coordinates;
        return coords[0] >= gb[0] && coords[0] < gb[2] && coords[1] >= gb[3] && coords[1] < gb[1]
      });

    for (let i = 0; i < particleGeometry.count; i++) {
      const image = images[i];
      if (image) {
        const coords = this.mapToScreen([image.geometry.coordinates[0], image.geometry.coordinates[1]], screenBounds);
        particleGeometry.position.array[i * 3 + 0] = coords[0];
        particleGeometry.position.array[i * 3 + 1] = coords[1];
        particleGeometry.position.array[i * 3 + 2] = 0;
        particleGeometry.color.array[i * 4 + 0] = 0.62;
        particleGeometry.color.array[i * 4 + 1] = 0.6;
        particleGeometry.color.array[i * 4 + 2] = 0.7;
        particleGeometry.color.array[i * 4 + 3] = 1
      } else {
        particleGeometry.position.array[i * 3 + 0] = 0;
        particleGeometry.position.array[i * 3 + 1] = 0;
        particleGeometry.position.array[i * 3 + 2] = 0;
        particleGeometry.color.array[i * 4 + 0] = 0;
        particleGeometry.color.array[i * 4 + 1] = 0;
        particleGeometry.color.array[i * 4 + 2] = 0;
        particleGeometry.color.array[i * 4 + 3] = 0
      }
    }

    particleGeometry.position.needsUpdate = true;
    particleGeometry.color.needsUpdate = true;
    particleGeometry.data = images;
    return particleGeometry
  }

  @autobind
  renderSightings (particleGeometry, screenBounds, expedition, gb) {
    const sightings = expedition.currentSightings
      .filter((sighting, _i) => {
        const { position } = sighting;
        return position.x >= gb[0] && position.x < gb[2] && position.y >= gb[3] && position.y < gb[1]
      });

    for (let i = 0; i < particleGeometry.count; i++) {
      const sighting = sightings[i];
      if (sighting) {
        const { position, radius } = sighting;
        const coords = this.mapToScreen([position.x, position.y], screenBounds);
        const color = new THREE.Color(sighting.color);
        particleGeometry.position.array[i * 3 + 0] = coords[0];
        particleGeometry.position.array[i * 3 + 1] = coords[1];
        particleGeometry.position.array[i * 3 + 2] = radius * 2;
        particleGeometry.color.array[i * 4 + 0] = color.r;
        particleGeometry.color.array[i * 4 + 1] = color.g;
        particleGeometry.color.array[i * 4 + 2] = color.b;
        particleGeometry.color.array[i * 4 + 3] = 1
      } else {
        particleGeometry.position.array[i * 3 + 0] = 0;
        particleGeometry.position.array[i * 3 + 1] = 0;
        particleGeometry.position.array[i * 3 + 2] = 0;
        particleGeometry.color.array[i * 4 + 0] = 0;
        particleGeometry.color.array[i * 4 + 1] = 0;
        particleGeometry.color.array[i * 4 + 2] = 0;
        particleGeometry.color.array[i * 4 + 3] = 0
      }
    }

    particleGeometry.position.needsUpdate = true;
    particleGeometry.color.needsUpdate = true;
    particleGeometry.data = sightings;
    return particleGeometry
  }

  @autobind
  renderMembers (geometry, screenBounds, _expedition, _gb) {
    if (!this.simpleState.members) return geometry;
    return Object.keys(this.simpleState.members).map(name => {
      const member = this.simpleState.members[name];
      const position = this.mapToScreen(member.coordinates, screenBounds);
      return {
        name,
        position
      }
    });
  }

  render () {
    const { expedition, show360Picture, lightBoxActive } = this.props;
    const { viewport, currentDate } = this.simpleState;
    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaWFhYWFuIiwiYSI6ImNpbXF1ZW4xOTAwbnl3Ymx1Y2J6Mm5xOHYifQ.6wlNzSdcTlonLBH-xcmUdQ';
    const MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-v9?format=jpg70';

    return (
      <div id="mapbox" style={{zIndex: (!lightBoxActive && ((location.pathname === '/map' || location.pathname === '/')) ? 0 : -100)}}>
        <MapGL
          {...viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          {expedition
          ? <div>
            <WebGLOverlay
              {...viewport}
              startDragLngLat={[0, 0]}
              redraw={this.redrawGLOverlay}
              show360Picture={show360Picture}
              currentDate={currentDate}
            />
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
  contentActive: PropTypes.bool,
  show360Picture: PropTypes.func.isRequired,
  lightBoxActive: PropTypes.bool.isRequired
};

export default BackgroundMap
