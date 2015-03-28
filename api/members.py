import geojson
from housepy import config, log

def assemble(self, search, limit, order):
    log.info("expeditions.assemble")
    try:
        results = self.db.features.find(search).distinct('properties.Member')
    except Exception as e:
        return self.error(log.exc(e))
    response = results
    return self.json(response)
