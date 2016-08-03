import React, { PropTypes } from 'react'
import NavigationItem from './NavigationItem'

const Navigation = ({currentPage}) => {
  return(
    <div id="header">
      <div id="navigation">
        <ul>
          <NavigationItem active={currentPage == 'map'}>Map</NavigationItem>
          <NavigationItem active={currentPage == 'journal'}>Journal</NavigationItem>
          <NavigationItem active={currentPage == 'data'}>Data</NavigationItem>
          <NavigationItem active={currentPage == 'about'}>About</NavigationItem>
          <NavigationItem active={currentPage == 'share'}>Share</NavigationItem>
        </ul>
      </div>
      <h1>INTO THE OKAVANGO</h1>
    </div>
  )
}

Navigation.propTypes = {
  currentPage: PropTypes.string.isRequired,
}

export default Navigation