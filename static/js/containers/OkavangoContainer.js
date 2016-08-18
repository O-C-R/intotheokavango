
import { connect } from 'react-redux'
import Okavango from '../components/Okavango'
import * as actions from '../actions.js'

const mapStateToProps = (state, ownProps) => {
  return {
    expedition: state.expeditions[state.selectedExpedition],
    children: ownProps.children,
    animate: state.animate,
    isFetching: state.isFetching,
    mapStateNeedsUpdate: state.mapStateNeedsUpdate,
    expeditionID: state.selectedExpedition,
    contentActive: state.contentActive,
    initialPage: state.initialPage
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchDay: (currentDate) => {
      return dispatch(actions.fetchDay(currentDate))
    },
    updateMap: (currentDate, coordinates, viewGeoBounds, zoom, expeditionID) => {
      return dispatch(actions.updateMap(currentDate, coordinates, viewGeoBounds, zoom, expeditionID))
    },
    setControl: (target, mode) => {
      return dispatch(actions.setControl(target, mode))
    },
    jumpTo: (date, expeditionID) => {
      return dispatch(actions.jumpTo(date, expeditionID))
    },
    setPage: () => {
      return dispatch(actions.setPage())
    },
    enableContent: () => {
      return dispatch(actions.enableContent())
    }
  }
}

const OkavangoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Okavango)

export default OkavangoContainer
