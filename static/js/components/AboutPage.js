
import React, {PropTypes} from 'react'

const AboutPage = () => {
  return (
    <div className='page'  id="aboutPage">

      <div className="pageWrapper">
        <div className="cta">
          <a href="https://www.nationalgeographic.org/projects/okavango/">
            <p>
              The National Geographic Okavango Wilderness Project
              <img src="static/img/external-link.svg" width="25px"/>
            </p>
          </a>
        </div>
        <div className="content">
  
          <h1>
            What We’re Doing
          </h1>
          <p>
            The Okavango Delta is one of the most important sites for biodiversity, hosting the largest population of African elephants in addition to lions, cheetahs, wild dogs and hundreds of species of birds. Yet the future of this oasis is directly linked to its source - over 800 miles to the north in the central highlands of Angola. This water tower, which flows through Angola, Namibia and Botswana, is the main source of water for over a million people, providing the lifeline for the region. While the Delta itself has been declared a World Heritage Site, the rivers and wilderness areas it depends on remain unprotected.
          </p>
          <img src="static/img/about-cuito.jpg" className="photo" width="100%"/>
          <p>
            Beginning in 2015, National Geographic Fellow, Dr. Steve Boyes, assembled a team of regional and international scientists to embark on a multi-year journey to explore and protect the headwaters and rivers in Angola. Covering thousands of miles on foot, bike, and mokoro, or traditional canoe, the team is discovering an area that has long been hidden behind a curtain of landmines – a legacy of past conflict. Their findings, which include potential new species to science and to Angola, countless species range extensions, and an intricate ecosystem that regulates the ebb and flow of the entire basin system, highlight the need to protect this area before it is too late.
          </p>
          <img src="static/img/about-elephants.jpg" className="photo" width="100%"/>

        </div>

        <div className="cta">
          <a href="https://www.nationalgeographic.org/projects/okavango/">
            <p>
              The National Geographic Okavango Wilderness Project
              <img src="static/img/external-link.svg" width="25px"/>
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
