
import React, {PropTypes} from 'react'

const YearSelector = ({onYearChange}) => {

  var toggleDropdown = () => {
    document.getElementById("YearSelectorDropdown").classList.toggle("show")
  }

  return (
    <div className="dropdown yearSelector">
      <button onClick={toggleDropdown} className="dropbtn">2016 Expedition</button>
      <div id="YearSelectorDropdown" className="dropdown-content">
        <a href="#" onClick={onYearChange}>2016</a>
        <a href="#" onClick={onYearChange}>2015</a>
        <a href="#" onClick={onYearChange}>2014</a>
        <a href="#" onClick={onYearChange}>2013</a>
      </div>
    </div>
  )
}

YearSelector.propTypes = {
  onYearChange: PropTypes.func.isRequired
}

export default YearSelector
