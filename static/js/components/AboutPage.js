
import React, {PropTypes} from 'react'

const AboutPage = () => {
  return (
    <div className='page'  id="aboutPage">

      <div className="pageWrapper">
        <iframe className="vimeo" src="https://player.vimeo.com/video/124421450?autoplay=0&api=1" width={window.innerWidth * 0.9} height={window.innerWidth * 0.9 * 0.525} frameBorder="0"allowFullScreen></iframe>
        <div className="columnWrapper">
          <div className="column">
            <h1>
              What We’re Doing
            </h1>
            <p>
              The greater Okavango River Basin is the largest freshwater wetland in southern Africa—and the main source of water for a million people. Its delta, located in northern Botswana, is one of Africa’s richest places for biodiversity, and home to the world’s largest remaining elephant population as well as lions, cheetahs, wild dogs, and hundreds of species of birds. But the delta’s future is uncertain. Its health is linked to that of rivers that originate in Angola, then converge and flow through Namibia into Botswana. These rivers are vital to the region’s future, but are currently unprotected outside of Botswana.
            </p>
          </div>
          <div className="column">
            <p>
              Beginning in 2015, National Geographic Explorer Dr. Steve Boyes and an interdisciplinary team including Angolan, Namibian, and South African scientists began working together to explore and protect the rivers in Angola. Through a series of unique canoe- and mountain bike–based expeditions into the least known, most inaccessible parts of the watershed in southeastern Angola, they have been surveying the sources of the river systems and collecting data to help inform strategies to protect them.
            </p>
            <p>
              The team is using their scientific and survey work to build connections among governments, non-governmental organizations, and local communities to help inform planning for the long-term goal of establishing sustainable management of the Okavango watershed’s source rivers to protect them forever.
            </p>
          </div>
        </div>
        <div className="columnWrapper cta">
          <a href="https://www.nationalgeographic.org/projects/okavango/">
            <p>
              To find out more, visit The Okavango Wilderness Project page.
            </p>
          </a>
        </div>
      </div>

    </div>
  )
}

AboutPage.propTypes = {
  // active: PropTypes.bool.isRequired
}

export default AboutPage
