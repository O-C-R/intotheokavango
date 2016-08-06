
import { connect } from 'react-redux'
import ControlPanel from '../components/ControlPanel'

const mapStateToProps = (state, ownProps) => {
  var props = {
    currentPage: state.currentPage,
    expeditionID: state.selectedExpedition,
    expeditions: state.expeditions
  }

  var expedition = state.expeditions[state.selectedExpedition]
  if (props.expeditionID) {
    props.date = expedition.currentDate
    props.playback = expedition.playback
    props.mainFocus = expedition.mainFocus
    props.secondaryFocus = expedition.secondaryFocus
    props.zoom = expedition.zoom
    props.layout = expedition.layout
  }

  return props
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onYearChange: (value) => {
      dispatch({'type': 'SET_EXPEDITION', 'id': value})
    },
    onPlaybackChange: (value) => {
      dispatch({'type': 'SET_CONTROL', 'target': 'playback', 'mode': value})
    },
    onMainFocusChange: (value) => {
      dispatch({'type': 'SET_CONTROL', 'target': 'mainFocus', 'mode': value})
    },
    onSecondaryFocusChange: (value) => {
      dispatch({'type': 'SET_CONTROL', 'target': 'secondaryFocus', 'mode': value})
    },
    onZoomChange: (value) => {
      dispatch({'type': 'SET_CONTROL', 'target': 'zoom', 'mode': value})
    },
    onLayoutChange: (value) => {
      dispatch({'type': 'SET_CONTROL', 'target': 'layout', 'mode': value})
    }
  }
}

const ControlPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel)

export default ControlPanelContainer
