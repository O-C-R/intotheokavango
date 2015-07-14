#!/usr/bin/env python3

import geojson, csv, dateutil, datetime, time, os, zipfile, pytz, xmltodict, json, shutil, urllib, math, subprocess
from housepy import config, log, util, strings, emailer, net
from mongo import db

EMAILS = "300234011091180@ast.globalalerting.com"

def main():
    log.info("beacon_sender...")
    try:
        core_sat = config['satellites'][0]
        last_beacon = list(db.features.find({'properties.FeatureType': "beacon", 'properties.Satellite': {'$eq': core_sat}}).sort('properties.t_utc', -1).limit(1))[0]
        datetime = last_beacon['properties']['DateTime']
        lon, lat = last_beacon['geometry']['coordinates']
        text = "Time:\n%s\n\nLat,Lon:\n%f,%f" % (datetime, lat, lon)
        log.info("--> last reported beacon (%s) at: %f,%f" % (datetime, lat, lon))
    except Exception as e:
        log.error("Could not get update: %s" % log.exc(e))
    try:
        log.info("Emailing to %s..." % EMAILS)
        emailer.send(EMAILS, "Core beacon location", text)
    except Exception as e:
        log.error("Could not email: %s" % log.exc(e))

main()
