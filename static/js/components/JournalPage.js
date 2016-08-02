
import React, {PropTypes} from 'react'
import Feed from './Feed'
import ControlPanelContainer from '../containers/ControlPanelContainer.js'

const JournalPage = ({active}) => {
  var posts = [
    {
      'key':1,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':2,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    },
    {
      'key':3,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com'
    }
  ]


  var className = 'page ' + (active?'active':'inactive')
  if(active){
    return (
      <div  className={className}  id="journalPage">
        <ControlPanelContainer/>
        <Feed posts={posts}/>
      </div>
    )
  } else {
    return null
  }
}

JournalPage.propTypes = {
  active : PropTypes.bool.isRequired
}

export default JournalPage
