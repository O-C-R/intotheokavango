
import React, {PropTypes} from 'react'

const FocusSelector = ({onFocusChange}) => {

  var toggleDropdown = () => {
    document.getElementById("FocusSelectorOptions").classList.toggle("show");
  }

  return (
    <div className="focusSelector">
      <p>Focus on:</p>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropbtn">Explorers</button>
        <div id="FocusSelectorOptions" className="dropdown-content">
          <a href="#" onClick={onFocusChange}>2016</a>
          <a href="#" onClick={onFocusChange}>2015</a>
          <a href="#" onClick={onFocusChange}>2014</a>
          <a href="#" onClick={onFocusChange}>2013</a>
        </div>
      </div>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropbtn">Steve</button>
        <div id="FocusSelectorOptions" className="dropdown-content">
          <a href="#" onClick={onFocusChange}>2016</a>
          <a href="#" onClick={onFocusChange}>2015</a>
          <a href="#" onClick={onFocusChange}>2014</a>
          <a href="#" onClick={onFocusChange}>2013</a>
        </div>
      </div>
    </div>
  )
}

FocusSelector.propTypes = {
  onFocusChange: PropTypes.func.isRequired
}

export default FocusSelector