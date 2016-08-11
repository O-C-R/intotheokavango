
import { connect } from 'react-redux'
import Okavango from '../components/Okavango'
import * as actions from '../actions.js'

const mapStateToProps = (state, ownProps) => {
  return {
    expedition: state.expeditions[state.selectedExpedition],
    children: ownProps.children,
    animate: state.animate,
    isFetching: state.isFetching,
    mapStateNeedsUpdate: state.mapStateNeedsUpdate
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchDay: (currentDate) => {
      return dispatch(actions.fetchDay(currentDate))
    },
    updateMap: (currentDate, coordinates, viewGeoBounds) => {
      return dispatch(actions.updateMap(currentDate, coordinates, viewGeoBounds))
    },
    setControl: (target, mode) => {
      return dispatch(actions.setControl(target, mode))
    },
    jumpTo: (date) => {
      return dispatch(actions.jumpTo(date))
    }
  }
}

const OkavangoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Okavango)

export default OkavangoContainer
