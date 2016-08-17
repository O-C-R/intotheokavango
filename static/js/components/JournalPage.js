
import React, {PropTypes} from 'react'
import Feed from './Feed'
import ControlPanelContainer from '../containers/ControlPanelContainer.js'

const JournalPage = ({posts}) => {
  return (
    <div className='page' id="journalPage">
      <ControlPanelContainer pathName={location.pathname}/>
      <Feed posts={posts}/>
    </div>
  )
}

JournalPage.propTypes = {
  posts: PropTypes.array.isRequired
}

export default JournalPage
