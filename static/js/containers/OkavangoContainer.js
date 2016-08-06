
import { connect } from 'react-redux'
import Okavango from '../components/Okavango'

const mapStateToProps = (state, ownProps) => {
  return {
    expedition: state.expeditions[state.selectedExpedition],
    children: ownProps.children
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const OkavangoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Okavango)

export default OkavangoContainer
