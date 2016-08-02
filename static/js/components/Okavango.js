import React, { PropTypes } from 'react'
import MapBox from './MapBox'
import CurrentPage from '../containers/CurrentPage'


const Okavango = () => {
  return (
    <div id="root">
      <MapBox/>
      <CurrentPage/>
    </div>
  )
}

Okavango.propTypes = {}
export default Okavango