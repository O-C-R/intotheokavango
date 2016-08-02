
import React, {PropTypes} from 'react'

const LayoutSelector = ({onLayoutChange}) => {
  var types = ['rows','grid']
  var buttons = types.map(function(s,i){
    return (
      <li className="layoutButton" key={i} onClick={onLayoutChange}>
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
    </div>
  )
}

LayoutSelector.propTypes = {
  onLayoutChange: PropTypes.func.isRequired
}

export default LayoutSelector
