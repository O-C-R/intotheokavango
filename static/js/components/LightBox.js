
import React, { PropTypes } from 'react'
import Post from './Post'

const LightBox = ({active}) => {

    var height = {height: window.innerHeight-200}

    var post = {
      'key':1,
      'type':'tweet',
      'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.', 
      'date': Date.now(),
      'location': [0,0],
      'link': 'http://www.google.com',
      'image': '../static/img/photo.png'
    }

    var meta = {
      'type':post.type,
      'date':post.date,
      'location':post.location,
      'link':post.link
    }

    if(active){
      return(
        <div id="lightBox">
          <div className="contentWrapper" style={height}>
            <Post format="lightBox" meta={meta}>
              {post.image}
            </Post>
          </div>
        </div>
      )
    } else {
      return null
    }
}

LightBox.propTypes = {
  active: PropTypes.bool.isRequired
}
export default LightBox

