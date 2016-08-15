
import React, {PropTypes} from 'react'
import YearSelector from './YearSelector'
import DateSelector from './DateSelector'
import PlaybackSelector from './PlaybackSelector'
import FocusSelector from './FocusSelector'
import ZoomSelector from './ZoomSelector'
import LayoutSelector from './LayoutSelector'

const ControlPanel = ({pathName, expeditionID, expeditions, currentDate, playback, mainFocus, secondaryFocus, zoom, layout, onYearChange, onPlaybackChange, onMainFocusChange, onSecondaryFocusChange, onZoomChange, onLayoutChange, viewport}) => {
  if (!expeditionID) return <div className="controlPanel"></div>

  if (pathName === '/') pathName = '/map'

  // {pathName === '/map' ? <FocusSelector mainFocus={mainFocus} secondaryFocus={secondaryFocus} onMainFocusChange={onMainFocusChange} onSecondaryFocusChange={onSecondaryFocusChange}/> : null}
  return (
    <div className="controlPanel">
      <YearSelector expeditions={expeditions} expeditionID={expeditionID} onYearChange={onYearChange}/>
      <DateSelector expeditions={expeditions} expeditionID={expeditionID} currentDate={currentDate} />
      {pathName === '/map' ? <PlaybackSelector mode={playback} onPlaybackChange={onPlaybackChange}/> : null}
      {pathName === '/map' ? <ZoomSelector onZoomChange={onZoomChange} viewport={viewport}/> : null}
      {pathName === '/journal' ? <LayoutSelector mode={layout} onLayoutChange={onLayoutChange}/> : null}
    </div>
  )
}

ControlPanel.propTypes = {
  pathName: PropTypes.string.isRequired,
  expeditionID: PropTypes.string,
  expeditions: PropTypes.object,
  currentDate: PropTypes.object,
  playback: PropTypes.string,
  mainFocus: PropTypes.string,
  secondaryFocus: PropTypes.string,
  zoom: PropTypes.number,
  layout: PropTypes.string,
  onYearChange: PropTypes.func.isRequired,
  onPlaybackChange: PropTypes.func.isRequired,
  onMainFocusChange: PropTypes.func.isRequired,
  onSecondaryFocusChange: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onLayoutChange: PropTypes.func.isRequired,
  viewPort: PropTypes.object
}

export default ControlPanel
