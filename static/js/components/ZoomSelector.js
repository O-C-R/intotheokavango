
import React, {PropTypes} from 'react'
import ViewportMercator from 'viewport-mercator-project'

const ZoomSelector = ({onZoomChange, viewport}) => {
  var types = ['decrement', 'increment']
  var buttons = types.map(function (s, i) {
    return (
      <li className="zoomButton" key={i} onClick={() => { onZoomChange(s) }}>
        <img width="16" height="16"/>
      </li>
    )
  })

  const { project, unproject } = ViewportMercator({ ...viewport })
  var scaleRange = (unproject([64, 0])[0] - unproject([0, 0])[0]) * 111
  var scaleString = Math.round(scaleRange) + 'km'
  if (scaleRange < 1) scaleString = Math.round(scaleRange * 1000) + 'm'

  return (
    <div className="selector">
      <div className="column">
        <ul className="buttonRow">
          {buttons}
        </ul>
      </div>
      <svg className="column">
        <line x1={0} y1={17.5} x2={12} y2={17.5} stroke={'white'}/>
        <line x1={52} y1={17.5} x2={64} y2={17.5} stroke={'white'}/>
        <line x1={0.5} y1={12} x2={0.5} y2={22} stroke={'white'}/>
        <line x1={63.5} y1={12} x2={63.5} y2={22} stroke={'white'}/>
        <text x={32} y={18} fill={'white'} style={{
          fontSize: '12px',
          alignmentBaseline: 'middle',
          textAnchor: 'middle'
        }}>{scaleString}</text>
      </svg>
    </div>
  )
}

ZoomSelector.propTypes = {
  onZoomChange: PropTypes.func.isRequired,
  viewPort: PropTypes.object
}

export default ZoomSelector