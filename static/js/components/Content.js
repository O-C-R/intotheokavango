import React, { PropTypes } from 'react'

import LightBox from './LightBox'
import Timeline from './Timeline'

import MapPage from './MapPage'
import JournalPage from './JournalPage'
import DataPage from './DataPage'
import AboutPage from './AboutPage'
import SharePage from './SharePage'
import Navigation from './Navigation'


const Content = ({currentPage, onNavClick}) => {

  var height = {height: window.innerHeight-100}

  const page = () => {
    switch(currentPage){
      case 'map':
        return (<MapPage active/>)
        break
      case 'journal':
        return (<JournalPage active/>)
        break
      case 'data':
        return (<DataPage active/>)
        break
      case 'about':
        return (<AboutPage active/>)
        break
      case 'share':
        return (<SharePage active/>)
        break
      default:
        return (<MapPage active/>)
        break
    }
  }

  return (
    <div>
      <Navigation currentPage={currentPage} onNavClick={onNavClick}/>
      <div id="content" style={height}>
        <LightBox active={false}/>
        <Timeline/>
        <div id="pageContainer">
          {page()}
        </div>
      </div>
    </div>
  )
}

Content.propTypes = {
  currentPage : PropTypes.string.isRequired,
  onNavClick : PropTypes.func.isRequired
}

export default Content
