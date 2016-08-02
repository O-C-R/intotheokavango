
import React, {PropTypes} from 'react'
import YearSelector from './YearSelector'
import DateSelector from './DateSelector'
import PlaybackSelector from './PlaybackSelector'
import FocusSelector from './FocusSelector'
import ZoomSelector from './ZoomSelector'
import LayoutSelector from './LayoutSelector'


const ControlPanel = ({currentPage, expedition, date, playback, mainFocus, secondaryFocus, zoom, layout, onYearChange, onPlaybackChange, onMainFocusChange, onSecondaryFocusChange, onZoomChange, onLayoutChange}) => {
  
  return (
    <div className="controlPanel">
      <YearSelector expedition={expedition} onYearChange={onYearChange}/>
      <DateSelector date={date} />
      {currentPage === 'map' ? <PlaybackSelector mode={playback} onPlaybackChange={onPlaybackChange}/>:null}
      {currentPage === 'map' ? <FocusSelector mainFocus={mainFocus} secondaryFocus={secondaryFocus} onMainFocusChange={onMainFocusChange} onSecondaryFocusChange={onSecondaryFocusChange}/>:null}
      {currentPage === 'map' ? <ZoomSelector onZoomChange={onZoomChange}/>:null}
      {currentPage === 'journal' ? <LayoutSelector mode={layout} onLayoutChange={onLayoutChange}/>:null}
    </div>
  )
}

ControlPanel.propTypes = {
  expedition: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  playback: PropTypes.string.isRequired,
  mainFocus: PropTypes.string.isRequired,
  secondaryFocus: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  layout: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onPlaybackChange: PropTypes.func.isRequired,
  onMainFocusChange: PropTypes.func.isRequired,
  onSecondaryFocusChange: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onLayoutChange: PropTypes.func.isRequired,
}

export default ControlPanel