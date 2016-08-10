import geojson
from housepy import config, log, util, strings
from pymongo import ASCENDING, DESCENDING

def assemble(self, search, limit, order, resolution):
    log.info("expeditions.assemble")
    expeditions = {}
    try:
        results = self.db.features.find(search).distinct('properties.Expedition')
        for expedition in results:
            start_date = util.parse_date(str(config['start_date'][expedition]), tz=config['local_tz'])
            last_feature = list(self.db.features.find({'properties.Expedition': expedition, 'properties.t_utc': {'$gt': util.timestamp(start_date)}, 'properties.FeatureType': "beacon"}).sort([('properties.t_utc', DESCENDING)]).limit(1))[0]
            end_date = util.parse_date(last_feature['properties']['DateTime'], tz=config['local_tz'])
            duration = end_date - start_date
            try:
                ## there is an okavango hack here that ignores points west of the prime meridian
                max_lon = list(self.db.features.find({'properties.Expedition': expedition, 'properties.FeatureType': "beacon", 'geometry': {'$exists': True, '$ne': None}, 'geometry.coordinates.0': {'$gt': 0}}).sort([('geometry.coordinates.0', DESCENDING)]).limit(1))[0]['geometry']['coordinates'][0]
                min_lon = list(self.db.features.find({'properties.Expedition': expedition, 'properties.FeatureType': "beacon", 'geometry': {'$exists': True, '$ne': None}, 'geometry.coordinates.0': {'$gt': 0}}).sort([('geometry.coordinates.0', ASCENDING)]).limit(1))[0]['geometry']['coordinates'][0]
                max_lat = list(self.db.features.find({'properties.Expedition': expedition, 'properties.FeatureType': "beacon", 'geometry': {'$exists': True, '$ne': None}, 'geometry.coordinates.0': {'$gt': 0}}).sort([('geometry.coordinates.1', DESCENDING)]).limit(1))[0]['geometry']['coordinates'][1]
                min_lat = list(self.db.features.find({'properties.Expedition': expedition, 'properties.FeatureType': "beacon", 'geometry': {'$exists': True, '$ne': None}, 'geometry.coordinates.0': {'$gt': 0}}).sort([('geometry.coordinates.1', ASCENDING)]).limit(1))[0]['geometry']['coordinates'][1]
                bounds = min_lon, max_lat, max_lon, min_lat
            except Exception as e:
                log.warning(log.exc(e))
                bounds = None
            expeditions[expedition] = {'StartDate': start_date, 'Days': duration.days, 'Name': strings.titlecase(" ".join(expedition.split("_"))), 'GeoBounds': bounds}
    except Exception as e:
        return self.error(log.exc(e))
    total = returned = len(expeditions)
    return expeditions, total, returned
