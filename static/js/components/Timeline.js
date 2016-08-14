
import React, {PropTypes} from 'react'
import * as d3 from 'd3'

const Timeline = ({expedition, jumpTo}) => {
  if (!expedition) return <svg id="timeline"></svg>

  var height = window.innerHeight - 72
  var width = window.innerWidth * 0.05
  var padding = [2, 8]
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

  var x = width * 0.58

  const days = data.map((d, i) => {
    return <circle cx={x} cy={scaleDays(i)} r={2} key={i} fill="white"/>
  })


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
      <filter id="dropshadow" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="2" dy="0" result="offsetblur"/>
        <feMerge> 
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <line x1={x} x2={x} y1={range[0]} y2={range[1]} style={{stroke: 'white'}}/>
      <g>{ days }</g>
      <g transform={'translate(' + (x - 20) + ',' + (scaleTime(expedition.currentDate.getTime()) - 8) + ')'}>
        <path fill="#F9D144" d="M8,0c5,0,12,8,12,8s-7,8-12,8c-4.4,0-8-3.6-8-8C0,3.6,3.6,0,8,0z" style={{filter: 'url(#dropshadow)'}}/>
        <circle fill="#1F1426" cx="7.9" cy="7.8" r="3"/>
      </g>
    </svg>
  )
}

Timeline.propTypes = {
  expedition: PropTypes.object,
  jumpTo: PropTypes.func.isRequired
}
export default Timeline
