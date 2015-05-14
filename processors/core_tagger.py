#!/usr/bin/env python3

from housepy import config, log, util, strings
from mongo import db

def main():    
    log.info("core_tagger...")

    features = db.features.find({'properties.Expedition': config['expedition'], 'properties.CoreExpedition': {'$exists': False}})
    for feature in features:
        log.info("Updating feature %s" % feature['_id'])
        if 'Member' not in feature['properties']:
            log.warning("--> no member, feature_type is %s" % feature['properties']['FeatureType'])
            continue
        member = feature['properties']['Member']
        t = feature['properties']['t_utc']
        try:
            core = list(db.members.find({'Name': member, 't_utc': {'$lte': t}}).sort('properties.t_utc', -1).limit(1))[0]['Core']
        except Exception as e:
            log.info("--> no core entry at time %s" % t)
            continue
        db.features.update({'_id': feature['_id']}, {'$set': {'properties.CoreExpedition': core}})
        log.info("--> updated feature, CoreExpedition: %s" % core)

main()