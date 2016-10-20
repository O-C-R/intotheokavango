// based on CanvasOverlay from https://github.com/uber/react-map-gl/blob/master/src/overlays/canvas.react.js
import React, {PropTypes, Component} from 'react'
import ViewportMercator from 'viewport-mercator-project'
// import { Stage, Sprite } from 'react-pixi'
// import autobind from 'autobind-decorator'

// import ReactTHREE, {
//   Renderer,
//   Scene,
//   OrthographicCamera,
//   DirectionalLight,
//   AmbientLight
// } from 'react-three'
// import THREE from 'three'

import THREE from '../react-three-renderer/node_modules/three'
import React3 from '../react-three-renderer'

import autobind from 'autobind-decorator'

const PROP_TYPES = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  redraw: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default class WebGLOverlay extends Component {
  constructor (props) {
    super(props)

    const vertexShader = [
      'attribute vec4 customColor;',
      // 'varying vec4 vColor;',
      // 'attribute float customSize;',
      'attribute float customSize;',
      'void main() {',
      // '    vColor = customColor;',
      '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
      // '    gl_PointSize = customSize * ( 500.0 / length( mvPosition.xyz ) );',
      '    gl_PointSize = 50.0 * ( 500.0 / length( mvPosition.xyz ) );',
      '    gl_Position = projectionMatrix * mvPosition;',
      '}'
    ].join('\n')

    const fragmentShader = [
      'uniform sampler2D texture;',
      'varying vec4 vColor;',
      'void main() {',
      '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
      // '    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );',
      // '    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );',
      '}'
    ].join('\n')

    var particleGeometry = {
      count: 1000,
      position: new THREE.BufferAttribute(new Float32Array(1000 * 3), 3),
      index: new THREE.BufferAttribute(new Uint16Array(1000 * 1), 1),
      size: new THREE.BufferAttribute(new Float32Array(1000 * 1), 1)
    }

    for (var i = 0; i < particleGeometry.count; i++) {
      particleGeometry.index.array[i] = i
    }

    this.state = {
      particleGeometry,
      // particleAttributes: particleAttributes,
      renderParticles: () => {},
      // sightingTexture: new THREE.TextureLoader().load('static/img/sighting.png'),
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    }
  }

  componentWillReceiveProps (nextProps) {
    const { project } = ViewportMercator(nextProps)
    const renderParticles = nextProps.redraw({ project })

    if (!renderParticles) {
      this.setState({
        ...this.state,
        particles: null
      })
      return
    }

    this.setState({
      ...this.state,
      particles: renderParticles(this.state.particleGeometry),
      renderParticles
    })
  }

  render () {

    const { project } = ViewportMercator(this.props)
    const { width, height, longitude, latitude } = this.props

    const point = project([longitude, latitude])
    const startPoint = project([this.state.longitude, this.state.latitude])
    const left = point[0] - startPoint[0]
    const top = 0 - (point[1] - startPoint[1])
    const cameraProps = {
      left: 0,
      right: width,
      top: 0,
      bottom: height,
      near: 1,
      far: 5000,
      position: new THREE.Vector3(left, top, 600),
      lookAt: new THREE.Vector3(left, top, 0)
    }

                // size={this.state.particleGeometry.size}
    return (
      <React3
        mainCamera="camera"
        width={width}
        height={height}
        onAnimate={this._onAnimate}
        alpha={true}
      >
        <scene>
          <orthographicCamera
            name="camera"
            {... cameraProps}
          />
          { this.state.particles &&
            <points>
              <bufferGeometry
                position={this.state.particleGeometry.position}
                index={this.state.particleGeometry.index}
              />
              <pointsMaterial
                size={20.0}
                transparent={true}
                alphaTest={0.5}
              >
                <texture url={'static/img/sighting.png'}/>
              </pointsMaterial>
            </points>
          }
          {
          <mesh
            rotation={this.state.cubeRotation}
          >
            <planeGeometry
              width={0.5}
              height={0.5}
              widthSegments={1}
              heightSegments={1}
            />
            <meshBasicMaterial
              color={0xffff00}
            />
          </mesh>
        }
        </scene>
      </React3>
    )
  }

}

WebGLOverlay.propTypes = PROP_TYPES
