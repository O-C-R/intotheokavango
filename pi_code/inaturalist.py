import json
import requests

import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import LegacyApplicationClient

site = "https://www.inaturalist.org"
app_id = '4e10326bd83377287d728a17e792dd3a1d393d32aea338bd66a9378ddfd05d32'
app_secret = 'c9cc84a55fdc2cccb86e1964c5bab99e4e209c6e607ffd3fad3fe79b7dea6709'

client = LegacyApplicationClient(app_id)
oauth = OAuth2Session(app_id, client=client)

token = oauth.fetch_token(site + '/oauth/token', client_id=app_id, client_secret=app_secret, username='intotheokavango', password='Hipp0potamus')

#Get a single feature to use a test
#r = requests.get("http://dev.intotheokavango.org/api/features/?FeatureType=sighting&limit=1")
#jr = r.json()
#feature = jr['results']['features'][0]
#props = feature['properties']#

#if 'BirdName' in props:
#    species = props['BirdName']
#else:
#    species = props['SpeciesName']



def post_inaturalist(data, path):
    if 'BirdName' in data:
        species = props['BirdName']
    else:
        species = props['SpeciesName']
    payload = {
        'observation[species_guess]': species, # WILL NEED TO BE CHANGED TO SPECIES NAME?
        'observation[observed_on_string]' : props['DateTime'],
        'observation[description]' : 'This observation was made as part of the Okavango Wilderness Project, a 9-year endeavour to measure the heartbeat of the Okavango Delta. For more information, visit http://intotheokavango.org',
        'observation[longitude]' : feature['geometry']['coordinates'][0],
        'observation[latitude]' : feature['geometry']['coordinates'][1]
    }
    #File it
    r = oauth.post(site + "/observations.json", data=payload)
    response = r.json()
    observation_id = response[0]['id']
    #Add photos
    photoPayload = {"observation_photo[observation_id]" : observation_id}
    try:
        with open(path, 'rb') as f:
            r = oauth.post(site + "/observation_photos.json", data=photoPayload, files=f)
    projectPayload = {"project_observation[observation_id]" : observation_id, "project_observation[project_id]" : "800"}
    r = oauth.post(site  + "/project_observations.json", data=projectPayload)


