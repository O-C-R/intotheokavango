
import React, {PropTypes} from 'react'

const Post = ({format, data}) => {

  if (format === 'full') {
    var metaTypes = ['date']
    if (data.location) metaTypes.push('location')
    if (data.link) metaTypes.push('link')
    var meta = metaTypes.map((m, i) => {
      var value = (function () {
        if (m === 'date') {
          var d = new Date(data.date)
          var mo = d.getMonth()
          var da = d.getDate()
          var s = mo + ' / ' + da
          return (<p>{s}</p>)
        } else if (format === 'full') {
          return (<img width="16" height="16" key={i} src={'/static/img/icon-' + m + '.png'}/>)
        }
      })()
      return (
        <div className={m} key={i}>{value}</div>
      )
    })

    const content = data => {
      switch (data.type) {
        case 'tweet':
          var images = data.images ? data.images.map((url, i) => {
            return <img src={url} key={i}/>
          }) : ''
          return (
            <div>
              <p className="message">"{data.content}"</p>
              {images}
            </div>
          )
        case 'image':
          return (
            <div>
              <img src={data.images[0]}/>
              <p>{data.content}</p>
            </div>
          )
        case 'audio':
          var soundCloudURL = 'https://w.soundcloud.com/player/?url='
          soundCloudURL += data.link
          soundCloudURL += '&color=F8D143&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false'

          return (
            <div>
              <h2>{data.title}</h2>
              <p>sound</p>
              <iframe src={soundCloudURL}></iframe>
            </div>
          )
        case 'blog':
          return (
            <div>
              <h2>{data.title}</h2>
              <p>{data.content}</p>
              <p><a href={data.link}>Read more...</a></p>
            </div>
          )
        default:
          return ''
      }
    }

    return (
      <div className="post">
        <div className="type">
          <img width="16" height="16" src={'/static/img/icon-' + data.type+'.png'}/>
        </div>
        <div className="content">
          {content(data)}
          <div className="meta">
            {meta}
            <div className="share"><img width="16" height="16" src="static/img/icon-share.png"/></div>
            <div className="separator"></div>
          </div>
        </div>
      </div>
    )
  }

  return ''
}

Post.propTypes = {
  format: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
}

export default Post


