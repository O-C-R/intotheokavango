

import React, {PropTypes} from 'react'
import YearSelector from './YearSelector'
import DateSelector from './DateSelector'
import PlaybackSelector from './PlaybackSelector'
import FocusSelector from './FocusSelector'
import ZoomSelector from './ZoomSelector'
import LayoutSelector from './LayoutSelector'


const ControlPanel = ({pathName, expedition, date, playback, mainFocus, secondaryFocus, zoom, layout, onYearChange, onPlaybackChange, onMainFocusChange, onSecondaryFocusChange, onZoomChange, onLayoutChange}) => {
  
  return (
    <div className="controlPanel">
      <YearSelector expedition={expedition} onYearChange={onYearChange}/>
      <DateSelector date={date} />
      {pathName === '/map' ? <PlaybackSelector mode={playback} onPlaybackChange={onPlaybackChange}/>:null}
      {pathName === '/map' ? <FocusSelector mainFocus={mainFocus} secondaryFocus={secondaryFocus} onMainFocusChange={onMainFocusChange} onSecondaryFocusChange={onSecondaryFocusChange}/>:null}
      {pathName === '/map' ? <ZoomSelector onZoomChange={onZoomChange}/>:null}
      {pathName === '/journal' ? <LayoutSelector mode={layout} onLayoutChange={onLayoutChange}/>:null}
    </div>
  )
}

ControlPanel.propTypes = {
  pathName: PropTypes.string.isRequired,
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