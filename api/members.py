import geojson
from housepy import config, log

def assemble(self, search, limit, order, resolution):
    log.info("members.assemble")
    members = {}
    try:
        results = self.db.features.find(search).distinct('properties.Member')
        for member in results:
            members[member] = {}
            expeditions = list(self.db.features.find({'properties.Member': member}).distinct('properties.Expedition'))
            for expedition in expeditions:
                feature_types = list(self.db.features.find({'properties.Member': member, 'properties.Expedition': expedition}).distinct('properties.FeatureType'))
                members[member][expedition] = feature_types
    except Exception as e:
        return self.error(log.exc(e))
    total = returned = len(members)        
    return members, total, returned
