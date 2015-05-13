#!/usr/bin/env python3

import json, requests, os
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import LegacyApplicationClient
from housepy import config, log
from mongo import db

SITE = "https://www.inaturalist.org"
settings = config['iNaturalist']

client = LegacyApplicationClient(settings['app_id'])
oauth = OAuth2Session(settings['app_id'], client=client)
token = oauth.fetch_token(SITE + '/oauth/token', client_id=settings['app_id'], client_secret=settings['app_secret'], username=settings['username'], password=settings['password'])

def post_inaturalist(feature):
    log.info("post_inaturalist")
    if 'geometry' not in feature or feature['geometry'] is None:
        log.debug("Skipping sighting %s without geometry..." % feature['_id'])
        continue
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
        response = oauth.post(SITE + "/observations.json", data=payload).json()
        # log.debug("--> response: %s" % json.dumps(response, indent=4))
        observation_id = response[0]['id']
        log.info("--> observation_id is %s" % observation_id)
        db.features.update({"_id" : feature['_id']}, {'$set': {'properties.iNaturalistID': observation_id}})
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
            if 'Url' not in image:
                log.info("--> missing Url")
                continue
            path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", image['Url'].strip("/")))
            log.info("--> %s" % path)
            try:
                payload = {"observation_photo[observation_id]" : observation_id}
                files = {'file': (os.path.basename(path), open(path, 'rb'), 'image/jpeg')}
                response = oauth.post("%s/observation_photos.json" % SITE, data=payload, files=files)
                log.info("--> response: %s" % json.dumps(response.json(), indent=4))
            except IndexError as e:
                log.error(log.exc(e))
                continue

    try:
        log.info("Adding observation to project...")
        payload = {"project_observation[observation_id]" : observation_id, "project_observation[project_id]" : settings['project_id']}
        response = oauth.post(SITE  + "/project_observations.json", data=payload)
        log.info("--> response: %s" % json.dumps(response.json(), indent=4))
    except Exception as e:
        log.error(log.exc(e))


def main():
    features = db.features.find({'properties.FeatureType': "sighting", 'properties.Expedition': config['expedition'], 'properties.iNaturalistID': {'$exists': False}})
    for feature in features:
        post_inaturalist(feature)

main()