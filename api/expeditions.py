import geojson
from housepy import config, log, util
from pymongo import ASCENDING, DESCENDING

def assemble(self, search, limit, order, resolution):
    log.info("expeditions.assemble")
    expeditions = {}
    try:
        results = self.db.features.find(search).distinct('properties.Expedition')
        for expedition in results:
            start_date = util.parse_date(str(config['start_date'][expedition]))
            last_feature = list(self.db.features.find({'properties.Expedition': expedition, 'properties.t_utc': {'$gt': util.timestamp(start_date)}, 'properties.FeatureType': "beacon"}).sort([('properties.t_utc', DESCENDING)]).limit(1))[0]
            end_date = util.parse_date(last_feature['properties']['DateTime'])
            duration = end_date - start_date
            expeditions[expedition] = {'StartDate': start_date, 'Days': duration.days}
    except Exception as e:
        return self.error(log.exc(e))
    total = returned = len(expeditions)
    return expeditions, total, returned
