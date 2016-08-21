#!/usr/bin/env python3

import requests
from housepy import config, log, util, strings
from mongo import db

def main():    
    log.info("taxonomy_updater...")

    query = {'properties.Expedition': config['expedition'], 'properties.Taxonomy': {'$exists': True, '$eq': None}}
    log.debug(query)
    features = db.features.find(query)
    log.info("%s features found" % features.count())
    for feature in features:
        properties = feature['properties']
        if 'SpeciesName' not in properties:
            continue
        log.info("SpeciesName %s" % properties['SpeciesName'])        
        taxonomy = get_taxonomy(properties['SpeciesName'])
        if taxonomy is None:
            log.info("--> not found")
            continue
        try:
            db.features.update({"_id" : feature['_id']}, {'$set': {'properties.Taxonomy': taxonomy}})
        except Exception as e:
            log.error(log.exc(e))

def get_taxonomy(name):
    try:
        log.info("Getting taxonomy from GBIF...")
        response = requests.get("http://api.gbif.org/v1/species/search?q=" + name + "&rank=species")
        result = response.json()['results'][0]
        taxonomy = {strings.camelcase(key): value for (key, value) in result.items() if key in ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']}
    except IndexError:
        return None
    except Exception as e:
        log.error(log.exc(e))
        return None
    return taxonomy
    
main()
