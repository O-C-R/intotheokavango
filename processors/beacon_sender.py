#!/usr/bin/env python3

import geojson, csv, dateutil, datetime, time, os, zipfile, pytz, json, shutil, urllib, math, subprocess
from housepy import config, log, util, strings, emailer, net
from mongo import db

EMAILS = ",".join(config['geo_emails']) if config['geo_emails'] is not None else None

def main():
    log.info("beacon_sender...")
    if config['geo_emails'] is None or not len(config['geo_emails']):
        log.info("--> no emails")
        return
    text = []
    try:
        for satellite in config['satellites']:
            last_beacon = list(db.features.find({'properties.FeatureType': "beacon", 'properties.Satellite': {'$eq': satellite}}).sort('properties.t_utc', -1).limit(1))[0]
            datetime = last_beacon['properties']['DateTime']
            lon, lat = last_beacon['geometry']['coordinates']
            satellite = last_beacon['properties']['Satellite']
            text.append("%s\n%s\n%f,%f" % (satellite, datetime, lat, lon))
            log.info("--> last reported beacon (%s on %s) at: %f,%f" % (satellite, datetime, lat, lon))
    except Exception as e:
        log.error("Could not get update: %s" % log.exc(e))
    try:
        log.info("Emailing to %s..." % EMAILS)
        text = "\n\n".join(text)
        emailer.send(EMAILS, "Core beacon location", text)
    except Exception as e:
        log.error("Could not email: %s" % log.exc(e))

main()
