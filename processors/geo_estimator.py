#!/usr/bin/env python3

from housepy import config, log, util, strings
from ingest import estimate_geometry
from mongo import db

def main():    
    log.info("geo_estimator...")

    # for data tagged to a Member, find something else that's geotagged, best case ambit_geo
    features = db.features.find({'properties.EstimatedGeometry': {'$exists': True, '$ne': 'ambit_geo'}, 'properties.Member': {'$exists': True, '$ne': None}})
    for feature in features:
        log.info("Updating geometry for %s %s (currently from %s)..." % (feature['properties']['FeatureType'], feature['_id'], feature['properties']['EstimatedGeometry']))
        estimate_geometry(feature, db)

    # for non-member data, tag it to the beacons
    features = list(db.features.find({'properties.EstimatedGeometry': {'$exists': True, '$ne': 'beacon'}, 'properties.Member': {'$eq': None}}))
    for feature in features:
        log.info("Updating geometry for %s %s (currently from %s)..." % (feature['properties']['FeatureType'], feature['_id'], feature['properties']['EstimatedGeometry']))
        estimate_geometry(feature, db)

    ## what about Members who arent sending anything that's geotagged? should default to beacon.
    ## like say someone who is just tweeting

main()