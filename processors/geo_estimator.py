#!/usr/bin/env python3

from housepy import config, log, util, strings
from ingest import estimate_geometry
from mongo import db

def main():    
    log.info("geo_estimator...")
    features = db.features.find({'properties.EstimatedGeometry': {'$exists': True, '$ne': 'ambit_geo'}})
    for feature in features:
        log.info("Updating geometry for %s (currently %s)..." % (feature['_id'], feature['properties.EstimatedGeometry'])
        estimate_geometry(feature, db)

main()