
import React, {PropTypes} from 'react'

const Post = ({meta, format, children}) => {

  var metaTypes = ['date']
  if(meta.location) metaTypes.push('location')
  if(meta.link) metaTypes.push('link')
  
  var meta = metaTypes.map(function(m,i){
    
    var value = (function(){
      if(m === 'date') {
        var d = new Date(meta.date)
        var mo = d.getMonth()
        var da = d.getDate()
        var s = mo + '/' + da
        return (<p>{s}</p>)
      } else if(format == 'full') {
        return (<img width="16" height="16" key={i}/>)
      }
    })()
    
    return (
      <div className={m} key={i}>{value}</div>
    )
  })

  if(format === 'full'){

    return (
      <div className="post">
        <div className="type">
          <img width="16" height="16"/>
        </div>
        <div className="content">
          <p className="message">{children.toString()}</p>
          <div className="meta">
            {meta}
            <div className="share"><img width="16" height="16" /></div>
            <div className="separator"></div>
          </div>
        </div>
      </div>
    )
  }

  if(format === 'lightBox'){
    return (
      <div className="post lightBox">
        <div className="type">
          <img width="16" height="16"/>
          <div className="meta">
            {meta}
          </div>
        </div>
        <div className="content">
          <img src={children.toString()}/>
        </div>
        <div className="actions">
          <div className="close"><img width="16" height="16" /></div>
          <div className="share"><img width="16" height="16" /></div>
          <div className="permaLink"><img width="16" height="16" /></div>
        </div>
      </div>
    )
  }
}

Post.propTypes = {
  meta: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Post


