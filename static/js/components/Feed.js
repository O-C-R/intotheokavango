
import React, {PropTypes} from 'react'
import Post from './Post'

const Feed = ({posts}) => {
  const format = 'full'
  const postFeed = posts.map(post => {
    return (
      <Post format={format} data={post} key={post.key}>
        {post.content}
      </Post>
    )
  })

  return (
    <div id="feed">
      {postFeed}
    </div>
  )
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired
}

export default Feed




