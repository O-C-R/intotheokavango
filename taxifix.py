#!/usr/bin/env python3

import sys, requests, json
from housepy import strings, util, log
from mongo import db

def get_taxonomy(name):
    taxonomies = []
    try:
        print("Getting taxonomy from GBIF...")
        response = requests.get("http://api.gbif.org/v1/species/search?q=" + name + "&rank=species")
        results = response.json()['results']
        for result in results:
            taxonomy = {strings.camelcase(key): value for (key, value) in result.items() if key in ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']}
            taxonomies.append(taxonomy)
    except Exception as e:
        log.error(log.exc(e))
        return None
    return taxonomies


while True:

    species_name = input("Find current SpeciesName: ")
    species_name = strings.titlecase(species_name)
    result = db.features.find({'properties.SpeciesName': species_name})

    print("--> found %s instances of %s" % (result.count(), species_name))

    if result.count() == 0:
        pass
    else:
        break

new_name = input("Replace with: ")
new_name = strings.titlecase(new_name)
    
print("Taxonomy for %s:" % new_name)

taxonomies = get_taxonomy(new_name)
for t, taxonomy in enumerate(taxonomies):
    print("%s:" % t)    
    print(json.dumps(taxonomy, indent=4))

try:
    taxonomy_index = input("Which taxonomy to use? ")
    taxonomy = taxonomies[int(taxonomy_index)]
except Exception:
    print("\nWhoops!")
    exit()
except KeyboardInterrupt:
    print("\nBye!")
    exit()



db.features.update({'properties.SpeciesName': species_name}, {'$set': {'properties.SpeciesName': new_name, 'properties.Taxonomy': taxonomy}}, multi=True)

print("--> done")
