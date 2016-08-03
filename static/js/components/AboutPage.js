
import React, {PropTypes} from 'react'

const AboutPage = () => {
  return (
    <div  className='page'  id="aboutPage">

      <div className="pageWrapper">
        <video></video>
        <div className="columnWrapper">
          <div className="column headline">
            <p>
              120 days, 1,500 miles, 3 countries,<br/>
              2 rivers, 31 adventurers, 100% open data.<br/>
              Join us in real-time as we explore
            </p>
            <h1>
              THE BEATING HEART OF OUR PLANET
            </h1>
          </div>
          <div className="column">
            <p>
              The Okavango Delta is one of the world’s last great wetland wildernesses. Although the Delta has been awarded UNESCO WHS Status its catchments in the highlands of Angola are still unprotected and largely unstudied. Starting in May a team of Ba’Yei, scientists, engineers and adventurers will journey a 1500 miles down the Cuito River, finding new species, exploring new ground, and taking the pulse of this mighty river that brings life-giving water to the Jewel of the Kalahari. 
            </p>
            <p>
              This site displays data which is uploaded daily, via satellite, by the expedition team. Data is also available through a public API, allowing anyone to remix, analyze or visualize the collected information.
            </p>
          </div>
        </div>
        <div className="columnWrapper">
          <div className="column">
          </div>
          <div className="column">
          </div>
        </div>
        <div className="columnWrapper">
          <div className="column">
          </div>
          <div className="column">
          </div>
        </div>
      </div>

    </div>
  )
}

AboutPage.propTypes = {
  // active: PropTypes.bool.isRequired
}

export default AboutPage
