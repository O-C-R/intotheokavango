import geojson, datetime, json
from collections import deque
from housepy import config, log, util
from pymongo import ASCENDING, DESCENDING

def assemble(self, search, limit, order, resolution):
    log.info("features.assemble")
    if resolution != 0 and order != ASCENDING:
        return self.error("Cannot use resolution on reverse sorting")
    try:
        total = self.db.features.find(search).count()
        results = list(self.db.features.find(search).sort([('properties.t_utc', order)]).limit(limit))
        # log.debug(json.dumps(result.explain(), indent=4))
        features = [fix_id(feature) for feature in results]
        if resolution != 0 and len(features):
            features = temporal_filter(features, resolution)
        returned = len(features)
        features = geojson.FeatureCollection(features)            
    except Exception as e:
        return self.error(log.exc(e))
    log.info("Found %s features" % len(features['features']))
    return features, total, returned


def fix_id(feature):
    feature['id'] = feature['_id']
    del feature['_id']
    return feature

def temporal_filter(features, resolution):
    try:

        log.info("--> starting temporal_filter")
        first_t = features[0]['properties']['t_utc']
        dt = datetime.datetime.utcfromtimestamp(first_t)
        dt = dt.replace(hour=0, minute=0, second=0, microsecond=0)
        start_t = util.timestamp(dt)
        log.debug("start_date %s" % util.datestring(start_t))
        log.debug("stop_date %s" % util.datestring(features[-1]['properties']['t_utc']))
        log.debug("start_t %s" % start_t)
        log.debug("step %s" % resolution)

        results = []
        index_t = start_t
        index = 0
        while True:
            # log.debug("Checking %s..." % util.datestring(index_t))
            while index < len(features) and features[index]['properties']['t_utc'] < index_t:
                index += 1
            if index == len(features):
                break
            if not (features[index]['properties']['t_utc'] > index_t + resolution):
                # log.debug("--> %s %s %s" % (index, features[index]['id'], util.datestring(features[index]['properties']['t_utc'])))
                results.append(features[index])
            index_t += resolution

        log.info("--> done temporal_filter")
        return results
    except Exception as e:
        log.error(log.exc(e))
