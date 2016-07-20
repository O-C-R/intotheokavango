#!/usr/bin/env python3

import soundcloud, os, random, sys, time, json, io, tempfile
from housepy import config, log, util
from housepy.jobs import Jobs
from mongo import db

def main(job):      ## kind of retrofitting the task queue -- we're not passing anything, just triggering the upload

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


    features = db.features.find({'properties.FeatureType': "audio", 'properties.SoundCloudURL': {'$exists': True, '$eq': None}})
    for feature in features:
        log.info("Uploading %s..." % feature['properties']['UploadPath'])
        try:
            path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", feature['properties']['UploadPath']))
            title = feature['properties']['Title']
            soundcloud_url = upload(client, path, title)
            db.features.update({'_id': feature['_id']}, {'$set': {'properties.SoundCloudURL': soundcloud_url}})
        except Exception as e:
            log.error(log.exc(e))


def upload(client, path, title):
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


Jobs().process(main, tube="ingest_audio")