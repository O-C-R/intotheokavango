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
      position: new THREE.BufferAttribute(new Float32Array( [
        50, -50,  1.0,
         25, 50,  1.0,
         100,  1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0
      ]), 3),
      index: new THREE.BufferAttribute(new Uint16Array( [
        0,
        1,
        2,
        3,
        4,
        5
      ]), 1),
      size: new THREE.BufferAttribute(new Float32Array( [
        1,
        2,
        0.5,
        0.2,
        1,
        0.2
      ]), 1),
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
      particles: renderParticles(project),
      renderParticles
    })
  }

  // render () {
  //   return (
  //     <Stage width={window.innerWidth} height={window.innerHeight} transparent={true} backgroundColor={0x000000} children={this.state.children}/>
  //   )
  // }

  // render () {
  //   const { project } = ViewportMercator(this.props)
  //   const { width, height, longitude, latitude } = this.props

  //   const point = project([longitude, latitude])
  //   const startPoint = project([this.state.longitude, this.state.latitude])
  //   const left = point[0] - startPoint[0]
  //   const top = 0 - (point[1] - startPoint[1])

  //   // const cameraProps = {
  //   //   left: 0,
  //   //   right: width,
  //   //   top: height,
  //   //   bottom: 0,
  //   //   near: 1,
  //   //   far: 5000,
  //   //   position: new THREE.Vector3(left, top, 600),
  //   //   lookat: new THREE.Vector3(left, top, 0)
  //   // }

  //   return (
  //     <div></div>

  //   )
  // }

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
                size={this.state.particleGeometry.size}
              />
              <pointsMaterial
                size={20.0}
                depthTest={false}
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
