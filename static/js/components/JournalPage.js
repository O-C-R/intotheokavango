
import React, {PropTypes} from 'react'
import Feed from './Feed'
import ControlPanelContainer from '../containers/ControlPanelContainer.js'
// import autobind from 'autobind-decorator'

class JournalPage extends React.Component {
  
  render () {
    const {posts, fetchPostsByDay, expedition} = this.props
    return (
      <div className='page' id="journalPage">
        <ControlPanelContainer pathName={location.pathname}/>
        <Feed posts={posts} fetchPostsByDay={fetchPostsByDay} expedition={expedition}/>
      </div>
    )
  }
}

JournalPage.propTypes = {
  posts: PropTypes.array.isRequired,
  expedition: PropTypes.object,
  fetchPostsByDay: PropTypes.func.isRequired
}

export default JournalPage
