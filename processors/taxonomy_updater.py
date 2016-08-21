#!/usr/bin/env python3

from housepy import config, log, util, strings
from mongo import db

def main():    
    log.info("taxonomy_updater...")

    features = db.features.find({'properties.Expedition': config['expedition'], 'properties.Taxonomy': {'$exists': True, '$eq': None}})
    for feature in features:
        if 'SpeciesName' not in feature:
            continue
        log.info("SpeciesName %s" % feature['SpeciesName'])        
        taxonomy = get_taxonomy(feature['SpeciesName'])
        if taxonomy is None:
            log.info("--> not found")
            continue
        try:
            # db.features.update({"_id" : feature['_id']}, {'$set': {'properties.Taxonomy': taxonomy}}, multi=True)
            pass
        except Exception as e:
            log.error(log.exc(e))

def get_taxonomy(name):
    try:
        log.info("Getting taxonomy from GBIF...")
        response = requests.get("http://api.gbif.org/v1/species/search?q=" + name + "&rank=species")
        result = response.json()['results'][0]
        taxonomy = {strings.camelcase(key): value for (key, value) in result.items() if key in ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']}
    except Exception as e:
        log.error(log.exc(e))
        return None
    return taxonomy
    
main()