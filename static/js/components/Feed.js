
import React, {PropTypes} from 'react'
import Post from './Post'
import * as d3 from 'd3'
import autobind from 'autobind-decorator'

class Feed extends React.Component {
  constructor (props) {
    super(props)
  }


  // componentWillUpdate () {
  //   this.onScroll()
  // }

  

  render () {
    const { posts } = this.props

    const format = 'full'
    const postFeed = posts.slice(0).reverse().map(post => {
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
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired,
  expedition: PropTypes.object,
  fetchPostsByDay: PropTypes.func.isRequired
}

export default Feed




