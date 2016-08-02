
import React, {PropTypes} from 'react'

const YearSelector = ({expedition, onYearChange}) => {

  var toggleDropdown = () => {
    document.getElementById("YearSelectorDropdown").classList.toggle("show")
  }

  return (
    <div className="dropdown yearSelector">
      <button onClick={toggleDropdown} className="dropbtn">{expedition}</button>
      <div id="YearSelectorDropdown" className="dropdown-content">
        <a href="#" onClick={()=>onYearChange('okavango_16')}>okavango_16</a>
        <a href="#" onClick={()=>onYearChange('okavango_15')}>okavango_15</a>
        <a href="#" onClick={()=>onYearChange('okavango_14')}>okavango_14</a>
        <a href="#" onClick={()=>onYearChange('okavango_13')}>okavango_13</a>
      </div>
    </div>
  )
}

YearSelector.propTypes = {
  onYearChange: PropTypes.func.isRequired,
  expedition: PropTypes.string.isRequired
}

export default YearSelector
