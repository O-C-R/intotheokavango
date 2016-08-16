import geojson
from housepy import config, log

""" list of species, with total counts across sightings for each one """

def assemble(self, search, limit, order, resolution):
    log.info("species.assemble")
    try:
        species = set(self.db.features.find(search).distinct('properties.SpeciesName'))
        birds = set(self.db.features.find(search).distinct('properties.BirdName'))
        species = [specie for specie in list(species | birds) if len(specie)]
        species.sort()
        results = {}
        total_count = 0
        for specie in species:
            search.update({'properties.SpeciesName': specie})
            # count = self.db.features.find(search).count()
            try:
                count = list(self.db.features.aggregate([ {'$match': search}, {'$group': {'_id': None, 'total': {'$sum': "$properties.Count"} }} ]))[0]['total']
            except Exception as e:
                log.error(log.exc(e))
                count = 0
            results[specie] = count
            total_count += count
    except Exception as e:
        return self.error(log.exc(e))
    species = results
    total = returned = len(species)       
    if 'properties.SpeciesName' in search:
        del search['properties.SpeciesName']
    return species, total, returned
