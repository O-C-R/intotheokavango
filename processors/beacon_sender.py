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
    for satellite in config['satellites']:
        try:
            last_beacon = list(db.features.find({'properties.FeatureType': "beacon", 'properties.Satellite': {'$eq': satellite}}).sort('properties.t_utc', -1).limit(1))
            if not len(last_beacon):
                continue
            last_beacon = last_beacon[0]
            dt = last_beacon['properties']['DateTime']
            if (datetime.datetime.now(pytz.timezone(config['local_tz'])) - util.parse_date(dt)).days > 30:
                continue
            lon, lat = last_beacon['geometry']['coordinates'][0], last_beacon['geometry']['coordinates'][1]
            satellite = last_beacon['properties']['Satellite']
            team = list(db.satellites.find({'Name': satellite}).sort('t_utc', -1).limit(1))[0]['Team']
            # if team is None:
            #     continue
            google = "https://www.google.com/maps/place/%s,%s" % (lat, lon)
            text.append("%s: %s\n%s\n%f,%f\n%s" % (satellite, team, dt, lat, lon, google))
            log.info("--> last reported beacon (%s: \"%s\" on %s) at: %f,%f" % (satellite, team, dt, lat, lon))
        except Exception as e:
            log.error("Could not get update: %s" % log.exc(e))
    try:
        log.info("Emailing to %s..." % EMAILS)
        text = "\n\n".join(text)
        emailer.send(EMAILS, "OWP beacon report", text)
    except Exception as e:
        log.error("Could not email: %s" % log.exc(e))

main()
