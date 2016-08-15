
import React, {PropTypes} from 'react'

const ZoomSelector = ({onZoomChange}) => {
  var types = ['decrement', 'increment']
  var buttons = types.map(function (s, i) {
    return (
      <li className="zoomButton" key={i} onClick={() => { onZoomChange(s) }}>
        <img width="16" height="16"/>
      </li>
    )
  })
  return (
    <div className="selector">
      <div className="column">
        <ul className="buttonRow">
          {buttons}
        </ul>
      </div>
      <svg className="column"></svg>
    </div>
  )
}

ZoomSelector.propTypes = {
  onZoomChange: PropTypes.func.isRequired
}

export default ZoomSelector