
import React, {PropTypes} from 'react'
import Post from './Post'
import autobind from 'autobind-decorator'
import * as d3 from 'd3'

class Feed extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      first: true
    }
    // d3.select('#feed').on('wheel',this.onScroll)
    // console.log()
  }

  // @autobind
  // startQuery () {

  //   requestAnimationFrame(this.startQuery)
  // }

  componentWillReceiveProps (nextProps) {
    const { posts, fetchPostsByDay, expedition } = this.props
    if (!expedition) return

    this.onScroll()

    // if (this.state.first) {
    //   this.startQuery()
    //   this.setState({
    //     first: false
    //   })
    // }
  }

  @autobind
  onScroll () {
    const { posts, fetchPostsByDay, expedition } = this.props
    if (!expedition) return

    var contentHeight = d3.select('#content').node().offsetHeight
    var feedHeight = d3.select('#feed').node().offsetHeight
    var scrollTop = d3.select('#content').node().scrollTop
    var postsByDay = expedition.postsByDay
    var dayCount = expedition.dayCount
    
    if ((posts.length === 0) || feedHeight < contentHeight || (scrollTop <= 100 && !postsByDay[dayCount]) || (scrollTop >= feedHeight - contentHeight - 100 && !postsByDay[0])) {
      fetchPostsByDay()
    }
  }

  render () {
    const { posts } = this.props

    const format = 'full'
    const postFeed = posts.map(post => {
      return (
        <Post format={format} data={post} key={post.key}>
          {post.content}
        </Post>
      )
    })

    return (
      <div id="feed" onWheel={this.onScroll}>
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




