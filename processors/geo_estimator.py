#!/usr/bin/env python3

from housepy import config, log, util, strings
from ingest import estimate_geometry
from mongo import db

def main():    
    log.info("geo_estimator...")

    # for data tagged to a Member, find something else that's geotagged with that Member, best case ambit_geo, worst case take the beacon
    ## for non-ambit wearers, this will keep querying, unfortunately
    features = db.features.find({'properties.EstimatedGeometry': {'$exists': True, '$ne': 'ambit_geo'}, 'properties.Member': {'$ne': None}})
    for feature in features:
        log.info("Updating geometry for %s %s (currently from %s)..." % (feature['properties']['FeatureType'], feature['_id'], feature['properties']['EstimatedGeometry']))
        feature = estimate_geometry(feature, db)
        ### update happens here

    # for non-member data, just tag it to the beacons
    features = db.features.find({'properties.EstimatedGeometry': {'$exists': True, '$ne': 'beacon'}, 'properties.Member': {'$eq': None}})
    for feature in features:
        log.info("Updating geometry for %s %s (currently from %s)..." % (feature['properties']['FeatureType'], feature['_id'], feature['properties']['EstimatedGeometry']))
        feature = estimate_geometry(feature, db)
        ### update happens here

    ## for members that arent wearing an ambit and arent on the main expedition, this will break

main()