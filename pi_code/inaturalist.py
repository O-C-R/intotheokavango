import json, requests, os
from housepy import config, log
# import requests

# import os
# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import LegacyApplicationClient

site = "https://www.inaturalist.org"
app_id = "4e10326bd83377287d728a17e792dd3a1d393d32aea338bd66a9378ddfd05d32"
app_secret = "c9cc84a55fdc2cccb86e1964c5bab99e4e209c6e607ffd3fad3fe79b7dea6709"
username = "intotheokavango"
password = "Hipp0potamus"
project_id = "800"

client = LegacyApplicationClient(app_id)
oauth = OAuth2Session(app_id, client=client)
token = oauth.fetch_token(site + '/oauth/token', client_id=app_id, client_secret=app_secret, username=username, password=password)


def post_inaturalist(feature):
    log.info("post_inaturalist")
    payload = {
        'observation[species_guess]': feature['properties']['SpeciesName'],
        'observation[observed_on_string]' : feature['properties']['DateTime'],
        'observation[description]' : "This observation was made as part of the Okavango Wilderness Project, a 9-year endeavour to measure the heartbeat of the Okavango Delta. For more information, visit http://intotheokavango.org",
        'observation[longitude]' : feature['geometry']['coordinates'][0],
        'observation[latitude]' : feature['geometry']['coordinates'][1]
    }

    log.debug(json.dumps(payload, indent=4))

    try:
        log.info("Sending payload...")
        response = oauth.post(site + "/observations.json", data=payload).json()
        # log.debug("--> response: %s" % json.dumps(response, indent=4))
        observation_id = response[0]['id']
        log.info("--> observation_id is %s" % observation_id)
    except Exception as e:
        log.error(log.exc(e))
        return False

    if 'Image' in feature['properties']:
        log.info("Adding photos...")
        images = []
        if 'Image' in feature['properties']:
            images.append(feature['properties']['Image'])
        if 'Images' in feature['properties']:
            for image in feature['properties']['Images']:
                images.append(image)
        for image in images:
            if 'URL' not in image:
                log.info("--> missing URL")
                continue
            path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", image['URL'].strip("/")))
            log.info("--> %s" % path)
            try:
                payload = {"observation_photo[observation_id]" : observation_id}
                files = {'file': open(path, 'rb')}
                response = oauth.post("%s/observation_photos.json" % site, data=payload, files=files)
                log.info("--> response: %s" % response)
            except IndexError as e:
                log.error(log.exc(e))
                continue

    try:
        log.info("Adding observation to project...")
        payload = {"project_observation[observation_id]" : observation_id, "project_observation[project_id]" : project_id}
        response = oauth.post(site  + "/project_observations.json", data=payload)
        log.info("--> %s" % response)
    except Exception as e:
        log.error(log.exc(e))



def test():

    #Get a single feature to use a test
    r = requests.get("http://localhost:7777/api/features/?FeatureType=sighting&limit=1")
    jr = r.json()
    feature = jr['results']['features'][0]

    # print(json.dumps(feature, indent=4))

    post_inaturalist(feature)


test()
