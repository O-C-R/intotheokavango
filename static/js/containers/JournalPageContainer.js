
import { connect } from 'react-redux'
import JournalPage from '../components/JournalPage'
import * as actions from '../actions.js'
import * as d3 from 'd3'

const mapStateToProps = (state, ownProps) => {
  const expeditionID = state.selectedExpedition
  const expedition = state.expeditions[expeditionID]
  if (!expedition) return { posts: [] }
  
  return {
    expedition: expedition,
    posts: d3.values(expedition.features).map(p => {
      var key = p.id
      var type = p.properties.FeatureType
      var date = new Date(p.properties.DateTime)
      var location = p.geometry.coordinates
      var author = p.properties.Member
      var title, content, images, link, dimensions

      if (type === 'tweet') {
        if (expeditionID !== 'okavango_14') {
          content = p.properties.Text
          images = p.properties.Images.map(i => { return i.Url })
          link = p.properties.Url
        } else {
          content = p.properties.Tweet.text
        }
      }

      if (type === 'image') {
        if (expeditionID !== 'okavango_14') {
          content = p.properties.Notes
          images = [p.properties.Url]
          link = p.properties.InstagramID
          dimensions = p.properties.Dimensions
        } else {
          content = p.properties.Notes
          images = [p.properties.Url]
          link = p.properties.InstagramID
          dimensions = p.properties.Size
        }
      }

      if (type === 'blog') {
        title = p.properties.Title
        content = p.properties.Summary
        link = p.properties.Url
      }

      if (type === 'audio') {
        title = p.properties.Title
        link = p.properties.SoundCloudURL
      }

      return {
        key,
        type,
        title,
        content,
        images,
        link,
        date,
        location,
        author,
        dimensions
      }
    })
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPostsByDay: () => {
      return dispatch(actions.fetchPostsByDay())
    }
  }
}

const JournalPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalPage)

export default JournalPageContainer
