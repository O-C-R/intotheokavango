
import React, {PropTypes} from 'react'
import {dateToString} from '../utils'

const DateSelector = ({expeditions, expeditionID, currentDate}) => {
  var expedition = expeditions[expeditionID]
  var dayCount = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
  var dateString = dateToString(currentDate)

  return (
    <div className="dateSelector">
      <p>DAY {dayCount}</p>
      <p>{dateString}</p>
    </div>
  )
}

DateSelector.propTypes = {
  expeditions: PropTypes.object.isRequired,
  expeditionID: PropTypes.string.isRequired,
  currentDate: PropTypes.object.isRequired
}

export default DateSelector
