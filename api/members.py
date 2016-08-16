import geojson
from housepy import config, log

def assemble(self, search, limit, order, resolution):
    log.info("members.assemble")
    members = {}
    try:
        results = self.db.members.find(search).distinct('Name')
        for member in results:
            expeditions = list(self.db.features.find({'properties.Member': member}).distinct('properties.Expedition'))
            members[member] = expeditions
            ## should probably have teams here too
    except Exception as e:
        return self.error(log.exc(e))
    total = returned = len(members)        
    return members, total, returned
