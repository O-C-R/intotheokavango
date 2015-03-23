import geojson
from housepy import config, log

def assemble(self, search):
    log.info("expeditions.assemble")
    try:
        result = self.db.features.find(search).distinct('properties.Member')
    except Exception as e:
        return self.error(log.exc(e))
    response = result
    return self.json(response)
