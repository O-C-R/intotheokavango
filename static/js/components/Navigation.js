import React, { PropTypes } from 'react'
import NavigationItem from './NavigationItem'

// <NavigationItem active={pathName === '/share'}>Share</NavigationItem>
// <NavigationItem active={pathName === '/data'}>Data</NavigationItem>
const Navigation = ({pathName}) => {

  return(
    <div id="header">
      <div id="navigation">
        <ul>
          <NavigationItem active={pathName === '/' || pathName === '/map'}>Map</NavigationItem>
          <NavigationItem active={pathName === '/journal'}>Journal</NavigationItem>
          <NavigationItem active={pathName === '/about'}>About</NavigationItem>
        </ul>
      </div>
      <h1>INTO THE OKAVANGO</h1>
      <img id="logo" src="static/img/logo.svg" alt="Into the Okavango"/>
    </div>
  )
}

Navigation.propTypes = {
  pathName: PropTypes.string.isRequired
}

export default Navigation