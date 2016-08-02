import React, { PropTypes } from 'react'
import NavigationItem from './NavigationItem'

const Navigation = ({currentPage, onNavClick}) => {
  return(
    <div id="header">
      <div id="navigation">
        <ul>
          <NavigationItem active={currentPage == 'map'} onClick={() => onNavClick('map')}>Map</NavigationItem>
          <NavigationItem active={currentPage == 'journal'} onClick={() => onNavClick('journal')}>Journal</NavigationItem>
          <NavigationItem active={currentPage == 'data'} onClick={() => onNavClick('data')}>Data</NavigationItem>
          <NavigationItem active={currentPage == 'about'} onClick={() => onNavClick('about')}>About</NavigationItem>
          <NavigationItem active={currentPage == 'share'} onClick={() => onNavClick('share')}>Share</NavigationItem>
        </ul>
      </div>
      <h1>INTO THE OKAVANGO</h1>
    </div>
  )
}

Navigation.propTypes = {
  currentPage: PropTypes.string.isRequired,
  onNavClick: PropTypes.func.isRequired
}

export default Navigation