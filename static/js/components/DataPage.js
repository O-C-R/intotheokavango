
import React, {PropTypes} from 'react'
import DataPageIndex from './DataPageIndex'
import APIExplorer from './APIExplorer'

const DataPage = ({active}) => {

  var className = 'page ' + (active?'active':'inactive')

  var sections = [
    {'key':1, 'title':'Overview', 'content':
      (<p>Lorem ipsum dolor sit amet</p>)
    },
    {'key':2, 'title':'Explore', 'content':
      (<APIExplorer/>)
    },
    {'key':3, 'title':'Documentation', 'content':
      (<p>Lorem ipsum dolor sit amet</p>)
    }
  ]

  var index = sections.map(function(section){
    return <h3 key={section.key}>{section.key} - {section.title}</h3>
  })

  var content = sections.map(function(section){
    return (
      <div key={section.key}>
        <h2>{section.key} - {section.title}</h2>
        {section.content}
      </div>
    )
  })

  return (
    <div  className={className}  id="dataPage">
      <DataPageIndex>
        {index}
      </DataPageIndex>
      <div id="dataPageContent">
        {content}
      </div>
    </div>
  )  
}

DataPage.propTypes = {
  active: PropTypes.bool.isRequired
}

export default DataPage