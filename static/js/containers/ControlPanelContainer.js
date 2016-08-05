
import { connect } from 'react-redux'
import ControlPanel from '../components/ControlPanel'

const mapStateToProps = (state, ownProps) => {
  return {
    currentPage: state.currentPage,
    expeditionID:state.expeditions.currentExpedition,
    expeditions:state.expeditions.expeditions,
    date: state.control.date,
    playback: state.control.playback,
    mainFocus: state.control.mainFocus,
    secondaryFocus: state.control.secondaryFocus,
    zoom: state.control.zoom,
    layout: state.control.layout,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => { 
  return {
    onYearChange: (value) => {
      dispatch({'type':'SET-EXPEDITION', 'value':value.k})
    },
    onPlaybackChange: (value) => {
      dispatch({'type':'CONTROL', 'target':'playback', 'value':value})
    },
    onMainFocusChange: (value) => {
      dispatch({'type':'CONTROL', 'target':'mainFocus', 'value':value})
    },
    onSecondaryFocusChange: (value) => {
      dispatch({'type':'CONTROL', 'target':'secondaryFocus', 'value':value})
    },
    onZoomChange: (value) => {
      dispatch({'type':'CONTROL', 'target':'zoom', 'value':value})
    },
    onLayoutChange: (value) => {
      dispatch({'type':'CONTROL', 'target':'layout', 'value':value})
    }
  }
}

const ControlPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel)


export default ControlPanelContainer
