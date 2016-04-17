#!/usr/bin/env python3

from housepy import config, log, util, strings
from ingest import estimate_geometry
from mongo import db

def main():    
    log.info("geo_estimator...")

    t = util.timestamp()

    # for data tagged to a Member, find something else that's geotagged with that Member, best case ambit_geo, worst case take the beacon if they are core, otherwise fail
    ## for non-ambit wearers, this will keep querying, unfortunately
    log.info("Updating features with a Member...")
    features = db.features.find({'properties.Expedition': config['expedition'], 'properties.EstimatedGeometry': {'$exists': True, '$ne': 'ambit_geo'}, 'properties.Member': {'$ne': None}})
    for feature in features:
        try:
            # if t - feature['properties']['t_utc'] > 60 * 60 * 48: ## after 48 hours, don't worry about it
            #     continue
            log.info("Updating geometry for %s %s (currently from %s)..." % (feature['properties']['FeatureType'], feature['_id'], feature['properties']['EstimatedGeometry']))
            feature = estimate_geometry(feature, db)
            db.features.update({"_id" : feature['_id']}, feature)
        except Exception as e:
            log.error(log.exc(e))

    # bh16 disabling this
    #
    # # for non-member data, just tag it to the beacons
    # log.info("Updating features without a Member...")
    # features = db.features.find({'properties.Expedition': config['expedition'], 'properties.EstimatedGeometry': {'$exists': True, '$ne': 'beacon'}, 'properties.Member': {'$eq': None}})
    # for feature in features:
    #     try:
    #         if t - feature['properties']['t_utc'] > 60 * 60 * 48: ## after 48 hours, don't worry about it
    #             continue
    #         log.info("Updating geometry for %s %s (currently from %s)..." % (feature['properties']['FeatureType'], feature['_id'], feature['properties']['EstimatedGeometry']))
    #         feature = estimate_geometry(feature, db)
    #         db.features.update({"_id" : feature['_id']}, feature)
    #     except Exception as e:
    #         log.error(log.exc(e))

main()