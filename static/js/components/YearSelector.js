
import React, {PropTypes} from 'react'

const YearSelector = ({expeditionID, expeditions, onYearChange}) => {
  var toggleDropdown = () => {
    document.getElementById('YearSelectorDropdown').classList.toggle('show')
  }

  var currentExpeditionName = expeditions[expeditionID].name
  var expeditionList = Object.keys(expeditions).map(function (k, i) {
    var expedition = expeditions[k]
    return <a href="#" onClick={() => onYearChange(k)} key={i}>{expedition.name}</a>
  })

  return (
    <div className="dropdown yearSelector">
      <button onClick={toggleDropdown} className="dropbtn">{currentExpeditionName}</button>
      <div id="YearSelectorDropdown" className="dropdown-content">
        {expeditionList}
      </div>
    </div>
  )
}

YearSelector.propTypes = {
  onYearChange: PropTypes.func.isRequired,
  expeditionID: PropTypes.string.isRequired,
  expeditions: PropTypes.object.isRequired
}

export default YearSelector
