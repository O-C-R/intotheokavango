#!/usr/bin/env python3

import sys, requests, json
from housepy import strings, util, log
from mongo import db, ObjectId

print("Sighting deduper")

results = db.features.aggregate([
    { '$match': { 
        'properties.FeatureType': "sighting",
    }},
    { '$group': { 
        '_id': { 'properties.t_utc': "$properties.t_utc", 'properties.Member': "$properties.Member"}, 
        'uniqueIds': { '$addToSet': "$_id" },
        'count': { '$sum': 1 } 
    }}, 
    { '$match': { 
        'count': { '$gt': 1 } 
    }}
], allowDiskUse=True)
results = list(results)

for result in results:
    log.info(result)

for result in results:
    feature_ids = result['uniqueIds']
    features = [db.features.find_one({'_id': feature_id}) for feature_id in feature_ids]
    features.sort(key=lambda f: f['properties']['t_created'])
    features.reverse()
    # note that we're taking the last one entered in the db as a gold standard -- if earlier entries have properties that arent in this one, they wont be checked
    gold = features[0]
    # print(json.dumps(gold, indent=4, default=lambda x: str(x)))    
    # print("%s potential duplicate%s" % (len(features[1:]), "s" if len(features[1:]) > 1 else ""))
    for feature in features[1:]:
        dup = True
        for prop in gold['properties']:
            if prop in feature['properties'] and feature['properties'][prop] != gold['properties'][prop]:
                if prop == "t_created":
                    continue
                dup = False
                # print("Not a dup: %s" % prop)
                break
        if dup:
            d = db.features.remove({'_id': feature['_id']})
            log.info(d)