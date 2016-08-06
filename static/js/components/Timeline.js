
import React, {PropTypes} from 'react'
import * as d3 from 'd3'

const Timeline = ({expedition, currentDate}) => {
  var height = window.innerHeight - 72
  var width = window.innerWidth * 0.02
  var padding = 2
  var dayCount = expedition.Days + 1
  var data = []

  var startDate = expedition.StartDate

  for (var i = 0; i < dayCount; i++) {
    var d = new Date(startDate.getTime() + i * (1000 * 3600 * 24))
    data.push(d)
  }

  var range = [0 + padding, height - padding]

  const scaleDays = d3.scaleLinear()
    .domain([0, dayCount])
    .range(range)

  const scaleTime = d3.scaleLinear()
    .domain([startDate.getTime(), startDate.getTime() + (dayCount) * (1000 * 3600 * 24)])
    .range(range)

  const days = data.map((d, i) => {
    return <circle cx={width - padding} cy={scaleDays(i)} r={2} key={i} fill="white"/>
  })

  return (
    <svg id="timeline" style={{height: height + 'px'}}>
      <g>{ days }</g>
      <circle id="cursor" cx={width - padding * 2} cy={scaleTime(currentDate.getTime())} r={4} fill="yellow"/>
    </svg>
  )
}

Timeline.propTypes = {
  // expedition: PropTypes.object.isRequired
  currentDate: PropTypes.object.isRequired
}
export default Timeline
