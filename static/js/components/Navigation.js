import React, { PropTypes } from 'react'
import NavigationItem from './NavigationItem'

const Navigation = ({pathName, setPage, activeLinks}) => {
          // <NavigationItem setPage={setPage} active={pathName === '/data'}>Data</NavigationItem>
          // <NavigationItem active={pathName === '/share'}>Share</NavigationItem>
  return (
    <div id="header">
      <div id="navigation">
        <ul>
          <NavigationItem enabled={activeLinks} setPage={setPage} active={pathName === '/' || pathName === '/map'}>Map</NavigationItem>
          <NavigationItem enabled={activeLinks} setPage={setPage} active={pathName === '/journal'}>Journal</NavigationItem>
          <NavigationItem enabled={activeLinks} setPage={setPage} active={pathName === '/data'}>Data</NavigationItem>
          <NavigationItem enabled={activeLinks} setPage={setPage} active={pathName === '/about'}>About</NavigationItem>
        </ul>
      </div>
      <h1>INTO THE OKAVANGO</h1>
      <img id="logo" src="static/img/logo.svg" alt="Into the Okavango"/>
    </div>
  )
}

Navigation.propTypes = {
  pathName: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  activeLinks: PropTypes.bool
}

export default Navigation