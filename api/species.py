import geojson
from housepy import config, log

def assemble(self, search, limit, order, resolution):
    log.info("expeditions.assemble")
    try:
        species = set(self.db.features.find(search).distinct('properties.SpeciesName')) ## no longer needed
        birds = set(self.db.features.find(search).distinct('properties.BirdName'))
        species = [specie for specie in list(species | birds) if len(specie)]
        species.sort()
        results = {}
        for specie in species:
            search.update({'properties.SpeciesName': specie})
            count = self.db.features.find(search).count()
            results[specie] = count
    except Exception as e:
        return self.error(log.exc(e))
    species = results
    total = returned = len(species)        
    del search['properties.SpeciesName']
    return species, total, returned
