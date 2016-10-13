// based on CanvasOverlay from https://github.com/uber/react-map-gl/blob/master/src/overlays/canvas.react.js
import React, {PropTypes, Component} from 'react';
import ViewportMercator from 'viewport-mercator-project';
import THREE from 'three';
import ReactTHREE, {
  Renderer,
  Scene,
  OrthographicCamera,
  DirectionalLight,
  AmbientLight
} from 'react-three';
import autobind from 'autobind-decorator'

const PROP_TYPES = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  redraw: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default class WebGLOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticChildren: null,
      dynamicChildren: null,
      preRenderedDynamicChildren: null,
      renderStaticChildren: () => {},
      renderDynamicChildren: () => {},
      getLatestIndex: () => {},
      latestIndex: -1,
      longitude: 0,
      latitude: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, unproject } = ViewportMercator(nextProps);
    const { width, height, longitude, latitude } = this.props;
    const { prerenderDynamicChildren } = this.state;

    if (!this.state.staticChildren) {
      const { renderStaticChildren, prerenderDynamicChildren, getLatestIndex} = nextProps.redraw({width, height, project, unproject});

      if (!(renderStaticChildren || prerenderDynamicChildren || getLatestIndex)) {
        this.setState({
          ...this.state,
          staticChildren: null,
          preRenderedDynamicChildren: null,
          latestIndex: -1
        });
        return;
      }

      this.setState({
        ...this.state,
        staticChildren: renderStaticChildren(project),
        preRenderedDynamicChildren: prerenderDynamicChildren(),
        latestIndex: getLatestIndex(),
        longitude,
        latitude,
        renderStaticChildren,
        prerenderDynamicChildren,
        getLatestIndex,
      });
    }

    // if (nextProps.redraw != this.props.redraw && this.state.preRenderedDynamicChildren) {
    //   const latestIndex = nextProps.redraw({width, height, project, unproject}).getLatestIndex();
    //   if (latestIndex > this.state.latestIndex) {
    //     this.setState({
    //       ...this.state,
    //       dynamicChildren: this.state.preRenderedDynamicChildren.slice(0, latestIndex).flatten().toArray(),
    //       latestIndex
    //     });
    //   }
    // }

    // if (getLatestIndex && renderDynamicChildren) {
    //   const latestIndex = getLatestIndex();
    //   if (latestIndex > this.state.latestIndex) {
    //     this.setState({
    //       ...this.state,
    //       dynamicChildren: renderDynamicChildren(latestIndex),
    //       latestIndex
    //     });
    //   }
    // }
  }

  render() {
    const { project } = ViewportMercator(this.props);
    const { width, height, longitude, latitude } = this.props;

    const point = project([longitude, latitude])
    const startPoint = project([this.state.longitude, this.state.latitude])
    const left = point[0] - startPoint[0];
    const top = 0 - (point[1] - startPoint[1]);

    const cameraProps = {
      left: 0,
      right: width,
      top: height,
      bottom: 0,
      near: 1,
      far: 5000,
      position : new THREE.Vector3(left,top,600),
      lookat : new THREE.Vector3(left,top,0)
    };

    // if (this.latestIndex <= this.props.redraw({width, height, project, unproject}).getLatestIndex()) {
    //   this.latestIndex = latestIndex;
    //   this.dynamicChildren = this.props.redraw({width, height, project, unproject}).renderDynamicChildren(this.latestIndex)
    //}

    // const left = mercator.project(this.props.longitude);
    // const top = this.props.height - mercator.project(this.props.latitude);
    // const point = project([longitude, latitude])
    // const left = point[0];
    // const top = height - point[1];

    // { this.props.redraw({
    //{/*/!*width: this.props.width,*!/*/}
    // {/*height: this.props.height, */}
    // {/*project: mercator.project,*/}
    // {/*unproject: mercator.unproject*/}
    // {/*}) }*/}

    // <Plane {...{
    //   position:new THREE.Vector3(left,top,0),
    //   quaternion:new THREE.Quaternion(),
    //   width: 200,
    //   height: 400,
    //   color: 0xda6f4e,
    //   opacity: 0.7
    // }}/>


    return <Renderer
      width={width}
      height={height}
      transparent={true}
    >
      <Scene width={width} height={height} camera="maincamera">
        <OrthographicCamera
          name="maincamera"
          {...cameraProps}
        />
        <AmbientLight color={0xffffff} intensity={1}/>
        {this.state.staticChildren}
        {this.state.dynamicChildren}
        {/*{this.state.renderDynamicChildren(500)}*/}
      </Scene>
    </Renderer>
  }
}

WebGLOverlay.propTypes = PROP_TYPES;
