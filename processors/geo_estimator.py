#!/usr/bin/env python3

from housepy import config, log, util, strings
from ingest import estimate_geometry
from mongo import db

def main():    
    log.info("geo_estimator...")

    t = util.timestamp()

    # for features with Members, try to re-estimate everything that's not tagged to an ambit_geo, just in case
    features = db.features.find({'properties.Expedition': config['expedition'], 'properties.EstimatedGeometry': {'$exists': True, '$ne': 'ambit_geo'}, 'properties.Member': {'$ne': None}})
    for feature in features:
        try:
            if t - feature['properties']['t_utc'] > (3 * 86400): # after 3 days, don't worry about it
                continue
            log.info("Updating geometry for %s %s (currently from %s)..." % (feature['properties']['FeatureType'], feature['_id'], feature['properties']['EstimatedGeometry']))
            feature = estimate_geometry(feature, db)
            db.features.update({"_id" : feature['_id']}, feature)
        except Exception as e:
            log.error(log.exc(e))

main()