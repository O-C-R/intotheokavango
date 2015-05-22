#!/usr/bin/env python3

from housepy import config, log, util, strings
from mongo import db

def main():    
    log.info("core_tagger...")

    t = util.timestamp()
    
    features = db.features.find({'properties.Expedition': config['expedition'], 'properties.CoreExpedition': {'$exists': False}})
    for feature in features:
        if t - feature['properties']['t_utc'] > 60 * 60 * 48: ## after 48 hours, don't worry about it
            continue        
        log.info("Updating feature %s" % feature['_id'])
        if 'Member' not in feature['properties']:
            log.warning("--> no member, feature_type is %s" % feature['properties']['FeatureType'])
            continue
        member = feature['properties']['Member']
        if member is None:
            core_sat = config['satellites'][0]
            if 'Satellite' in feature['properties']:
                core = feature['properties']['Satellite'] == core_sat
                log.info("--> satellite, core is %s" % core)
            else:
                log.info("--> null Member, core is True")
                core = True
        else:
            t = feature['properties']['t_utc']
            try:
                core = list(db.members.find({'Name': member, 't_utc': {'$lte': t}}).sort('properties.t_utc', -1).limit(1))[0]['Core']
            except Exception as e:
                log.info("--> no core entry at time %s" % t)
                continue
        db.features.update({'_id': feature['_id']}, {'$set': {'properties.CoreExpedition': core}})
        log.info("--> updated feature, CoreExpedition: %s" % core)

main()