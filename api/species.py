import geojson
from housepy import config, log

def assemble(self, search, limit, order):
    log.info("expeditions.assemble")
    try:
        species = set(self.db.features.find(search).distinct('properties.SpeciesName'))
        birds = set(self.db.features.find(search).distinct('properties.BirdName'))
        species = [specie for specie in list(species | birds) if len(specie)]
        species.sort()
    except Exception as e:
        return self.error(log.exc(e))
    return self.json(species)
