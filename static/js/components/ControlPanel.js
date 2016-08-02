
import React, {PropTypes} from 'react'
import YearSelector from './YearSelector'
import DateSelector from './DateSelector'
import PlaybackSelector from './PlaybackSelector'
import FocusSelector from './FocusSelector'
import ZoomSelector from './ZoomSelector'
import LayoutSelector from './LayoutSelector'


const ControlPanel = ({year, date, playback, focus, zoom, layout, onYearChange, onDateChange, onPlaybackChange, onFocusChange, onZoomChange, onLayoutChange}) => (
  <div className="controlPanel">
    {year?<YearSelector year={year} onClick={onYearChange}/>:null}
    {date?<DateSelector date={date} onClick={onDateChange}/>:null}
    {playback?<PlaybackSelector forward onClick={onPlaybackChange}/>:null}
    {focus?<FocusSelector onClick={onFocusChange}/>:null}
    {zoom?<ZoomSelector onClick={onZoomChange}/>:null}
    {layout?<LayoutSelector onClick={onLayoutChange}/>:null}
  </div>
)

ControlPanel.propTypes = {
  year: PropTypes.number.isRequired,
  date: PropTypes.object.isRequired,
  playback: PropTypes.string.isRequired,
  focus: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  layout: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onPlaybackChange: PropTypes.func.isRequired,
  onFocusChange: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onLayoutChange: PropTypes.func.isRequired,
}

export default ControlPanel