
import React, {PropTypes} from 'react'

const AboutPage = () => {
  return (
    <div className='page'  id="aboutPage">

      <div className="pageWrapper">
        <iframe className="vimeo" src="https://player.vimeo.com/video/124421450?autoplay=0&api=1" width={window.innerWidth * 0.9} height={window.innerWidth * 0.9 * 0.525} frameBorder="0"allowFullScreen></iframe>
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
            <div class="goalIcon"><img src="static/img/iconIntroUnderstand.png"/></div>
            <h2>UNDERSTAND<br/>THE WILDERNESS</h2>
            <p>
              To effectively protect the Okavango and its catchments it is essential to gain knowledge and insight into the functioning of the system as a whole. Starting in 2011 the Okavango Wilderness Project has conducted yearly transects of the Delta, gathering unique data and immersing the expedition members in the ebb and flow of this pristine wilderness. In 2015 the expedition will be extended to include a transect of one of the Delta’s feeder rivers, the Cuito. With its source deep in the remote highlands of Angola, this is one of the least known places on Earth. Travelling down the river, the team will collect data on insects, fish, birds, reptiles and mammals, as well as conduct water quality assessments and landscape surveys.
            </p>
          </div>
          <div className="column">
            <div class="goalIcon"><img src="static/img/iconIntroPreserve.png"/></div>
            <h2>RAISE AWARENESS<br/>AND PRESERVE</h2>
            <p>
              Although the Okavango itself is protected as a UNESCO World Heritage Site, its catchment and water supply in Angola and Namibia remain vulnerable to human interference. By gathering and freely disseminating information about the functioning and health of the entire system the 2015 expedition aims to raise the levels of both understanding and awareness of this unique and fragile system.
            </p>
            <p>
              Once base-line data on the system becomes freely available effective measures can then be implemented to insure the continued health and survival of this great African wilderness.
            </p>
          </div>
        </div>
        <div className="columnWrapper credits">
          <div className="column">
            <h2>
              EXPEDITION TEAM<br/><span class="job"><span class="explorerBox legend"></span> National Geographic Emerging Explorers</span>
            </h2>
            <p>
              Alex Paullin <span class="job">Camp Logistics</span><br/>Brian House <span class="job">Sound Artist</span><br/>Chris Boyes <span class="job">Expedition Leader</span><br/>Giles Trevethick <span class="job">Research Coordinator</span><br/>Gobonamang Kgetho <span class="job">Poler</span><br/>Gregg Treinish<span class="explorerBox"></span> <span class="job">Sensor Network Deployment</span><br/>James Kydd <span class="job">Expedition photographer</span><br/>Jer Thorp<span class="explorerBox"></span> <span class="job">Data Artist</span><br/>John Hilton <span class="job">Expedition Director</span><br/>Karen Ross <span class="job">Botswana WHS Bid Leader</span><br/>Kgalalela Mpetsang <span class="job">Poler</span><br/>Leillamang Kgetho <span class="job">Poler</span><br/>Maans Booysen <span class="job">Ornithology</span><br/>Pieter Hugo <span class="job">Camp Logistics</span><br/>Shah Selbe<span class="explorerBox"></span> <span class="job">Expedition Technologist</span><br/>Steve Boyes<span class="explorerBox"></span> <span class="job">Project Leader</span><br/>Topho Retiyo <span class="job">Poler</span><br/>Water Setlabosha <span class="job">Poler</span><br/>
            </p>
          </div>
          <div className="column">
            <h2>
              SCIENTIFIC TEAM
            </h2>
            <p>
              Adjany Costa <span class="job">Ichthyologist and Ornithologist</span><br/>Bill Branch <span class="job">Herpetologist</span><br/>David Goyder <span class="job">Botanist - Kew Gardens</span><br/>Gotz Neef <span class="job">Botanist & Entomologist</span><br/>Matt Janks <span class="job">Botanist</span><br/>Nigel Barker <span class="job">Botanist</span><br/>Nkosinathi Mazungula <span class="job">Ichthyologist</span><br/>Paul Skelton <span class="job">Ichthyologist</span><br/>Francisco Maiato <span class="job">Botanist</span><br/>
            </p>
            <h2>
              DOCUMENTARY TEAM
            </h2>
            <p>
              Alexandra Fuller<span class="job">Writer</span><br/>Cory Richards<span class="job">Photographer</span><br/>Mark Stone <span class="job">Assistant</span><br/>Neil Gelinas <span class="job">Filmmaker</span>
            </p>

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
