#!/usr/bin/env python3

import soundcloud
from housepy import config, log, util
from mongo import db

def main():

    settings = config['soundcloud']
    try:
        client = soundcloud.Client(
            client_id=settings['client_id'],
            client_secret=settings['client_secret'],
            username=settings['email'],
            password=settings['password']
        )
    except Exception as e:
        log.error("Could not establish SoundCloud client: %s" % log.exc(e))


    features = db.features.find({'properties.FeatureType': "audio", 'properties.SoundCloudURL': None})
    for feature in features:
        try:
            path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", feature['properties']['UploadPath']))
            title = feature['properties']['Title']
            soundcloud_url = upload(path, title)
            db.features.update({'_id': feature['_id']}, {'$set': {'properties.SoundCloudURL': youtube_url}})
        except HttpError as e:
            data = json.loads(e.content.decode('utf-8'))
            log.error("An HTTP error %d occurred:\n%s" % (e.resp.status, json.dumps(data, indent=4)))


def upload(path, title):
    log.info("Posting %s to soundcloud..." % path)
    try:
        with open(path, 'rb') as f:
            track = {'asset_data': f, 'sharing': "public", 'title': title}
            track = client.post('/tracks', track=track)
            soundcloud_url = track.permalink_url
    except Exception as e:
        log.error("--> could not post track to SoundCloud: %s" % log.exc(e))
        return None
    log.info("--> success: %s" % soundcloud_url)
    return soundcloud_url

main()
