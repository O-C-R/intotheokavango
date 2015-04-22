#!/usr/bin/env python3

from housepy import config, log, util, strings
from ingest import estimate_geometry
from mongo import db

def main():    
    log.info("Geo estimator...")
    features = db.features.find({'properties.EstimatedGeometry': {'$exists': True, '$ne': 'ambit'}})
    for feature in features:
        log.info("Updating geometry for %s" % feature['_id'])
        estimate_geometry(feature, db)

main()