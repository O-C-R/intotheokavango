import geojson
from housepy import config, log

def assemble(self, search):
    log.info("expeditions.assemble")
    try:
        results = self.db.features.find(search).distinct('properties.Expedition')
    except Exception as e:
        return self.error(log.exc(e))
    response = results
    return self.json(response)
