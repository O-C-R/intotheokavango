
import React, {PropTypes} from 'react'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import autobind from 'autobind-decorator'

class IntroductionBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      complete: false,
      contentEnabled: false,
      startDate: -1,
      currentPosts: [],
      posts: [
        {
          content: <p key="0"></p>,
          timeRange: [0, 4000]
        },
        {
          content: <p key="1">Right now, a group of Ba'yei, scientists and explorers are exploring the Cuando River, one of the sources of the Okavango Delta, in traditional flat-bottomed boats, gathering crucial biodiversity and environmental data.</p>,
          timeRange: [4000, 11000]
        },
        {
          content: <p key="2">You can use this platform to explore what the team is seeing and experiencing on their expedition through this remote and vitally important ecosystem.</p>,
          timeRange: [11000, 19000]
        }
      ]
    }
  }

  @autobind
  skip () {
    const { enableContent } = this.props
    this.state.complete = true
    this.state.contentEnabled = true
    enableContent()
  }

  @autobind
  tick () {
    const { enableContent } = this.props
    const { posts, startDate } = this.state

    if (!(location.pathname === '/map' || location.pathname === '/')) {
      requestAnimationFrame(this.tick)
      return
    } else if (startDate === -1) {
      this.setState({
        ...this.state,
        startDate: Date.now()
      })
      requestAnimationFrame(this.tick)
      return
    }

    const now = Date.now() - startDate;
    let currentPosts = [];
    posts.forEach(p => {
      if (p.timeRange[0] <= now && p.timeRange[1] > now) {
        currentPosts.push(
            p
        )
      }
    });

    if (now > posts[posts.length - 1].timeRange[1] - 6000 && !this.state.contentEnabled) {
      this.state.contentEnabled = true
      enableContent()
    }

    var flag = true
    if (currentPosts.length !== this.state.currentPosts.length) flag = false
    else {
      for (var i = 0; i < Math.max(currentPosts.length, this.state.currentPosts.length); i++) {
        if (currentPosts[i] !== this.state.currentPosts[i]) {
          flag = false
          break
        }
      }
    }

    if (!flag) {
      this.setState({
        ...this.state,
        currentPosts: currentPosts
      })
    }
    if (now > posts[posts.length - 1].timeRange[1]) {
      this.state.complete = true
      return
    }
    requestAnimationFrame(this.tick)
  }

  componentDidMount () {
    requestAnimationFrame(this.tick)
  }

  render () {
    const { currentPosts, complete } = this.state
    const { animate } = this.props
    const posts = currentPosts.map((p, i) => {
      return (<CSSTransition
        key={i}
        classNames="notif"
        timeout={{exit: 200, enter: 500}}
      ><div>{p.content}</div></CSSTransition>);
    })

    const container = () => {
      return (
        <TransitionGroup>
          {posts}
        </TransitionGroup>
      )
    }

    // if (complete || !animate) return <div></div>
    if (complete) return <div></div>
    return (
      <div id="IntroductionBox">
        {container()}
      </div>
    )
  }
}

IntroductionBox.propTypes = {
  enableContent: PropTypes.func.isRequired,
  animate: PropTypes.bool.isRequired
}

export default IntroductionBox
