
import React, {PropTypes} from 'react'
import * as d3 from 'd3'

const Timeline = ({expedition, jumpTo}) => {
  if (!expedition) return <svg id="timeline"></svg>

  var height = window.innerHeight - 72
  var width = window.innerWidth * 0.02
  var padding = [2,8]
  var dayCount = expedition.dayCount + 1
  var data = []

  var startDate = expedition.start

  for (var i = 0; i < dayCount; i++) {
    var d = new Date(startDate.getTime() + i * (1000 * 3600 * 24))
    data.push(d)
  }

  var range = [0 + padding[1], height - padding[1]]
  var domain = [0, dayCount - 1]

  const scaleDays = d3.scaleLinear()
    .domain(domain)
    .range(range)

  const scaleTime = d3.scaleLinear()
    .domain([startDate.getTime(), startDate.getTime() + (dayCount - 1) * (1000 * 3600 * 24)])
    .range(range)

  const days = data.map((d, i) => {
    return <circle cx={width - padding[0]} cy={scaleDays(i)} r={2} key={i} fill="white"/>
  })

  var x = width - padding[0] * 2

  const onMouseMove = (e) => {
    var y = e.nativeEvent.offsetY
    // var date = new Date(scaleTime.invert(y))
    // console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  const onClick = (e) => {
    var y = e.nativeEvent.offsetY
    jumpTo(new Date(scaleTime.invert(Math.max(range[0] + 1, Math.min(range[1] - 1, y)))))
  }

  return (
    <svg id="timeline" style={{height: height + 'px'}} onMouseMove={onMouseMove} onClick={onClick}>
      <line x1={x + 2} x2={x + 2} y1={range[0]} y2={range[1]} style={{stroke: 'white'}}/>
      <g>{ days }</g>
      <circle id="cursor" cx={x} cy={scaleTime(expedition.currentDate.getTime())} r={4} fill="yellow"/>
    </svg>
  )
}

Timeline.propTypes = {
  expedition: PropTypes.object,
  jumpTo: PropTypes.func.isRequired
}
export default Timeline
