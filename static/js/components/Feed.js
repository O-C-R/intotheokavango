
import React, {PropTypes} from 'react'
import Post from './Post'

const Feed = ({posts}) => {
  var format = 'full'
  var posts = posts.map(function(post, i){

    var meta = {
      'type':post.type,
      'date':post.date,
      'location':post.location,
      'link':post.link
    }

    return (
      <Post format={format} meta={meta} key={i}>
        {post.content}
      </Post>
    )
  })
  return (
    <div id="feed">
      {posts}
    </div>
  )
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired
}

export default Feed




