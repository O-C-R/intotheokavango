// based on CanvasOverlay from https://github.com/uber/react-map-gl/blob/master/src/overlays/canvas.react.js
import React, {PropTypes, Component} from 'react'
import ViewportMercator from 'viewport-mercator-project'
import { Stage, Sprite } from 'react-pixi'
// import autobind from 'autobind-decorator'

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
    this.state = {
      children: null,
      renderChildren: () => {}
    }
  }

  componentWillReceiveProps (nextProps) {
    const { project } = ViewportMercator(nextProps)
    const renderChildren = nextProps.redraw({ project })

    if (!renderChildren) {
      this.setState({
        ...this.state,
        children: null
      })
      return
    }

    this.setState({
      ...this.state,
      children: renderChildren(project),
      renderChildren
    })
  }

  render () {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight} transparent={true} backgroundColor={0x000000} children={this.state.children}/>
    )
  }
}

WebGLOverlay.propTypes = PROP_TYPES
