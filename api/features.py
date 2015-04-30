import geojson, datetime
from collections import deque
from housepy import config, log, util

def assemble(self, search, limit, order, resolution):
    log.info("features.assemble")
    try:
        total = self.db.features.find(search).count()
        results = list(self.db.features.find(search).sort([('properties.t_utc', order)]).limit(limit))
        # log.debug(json.dumps(result.explain(), indent=4))
        # temporal_filter(results)
        features = [fix_id(feature) for feature in results]
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

## will not work on reverse sort
## check that there are actual results

def temporal_filter(features):

    features = deque(features)
    first_t = features[0]['properties']['t_utc']
    dt = datetime.datetime.utcfromtimestamp(first_t)
    dt = dt.replace(hour=0, minute=0, second=0, microsecond=0)
    log.debug(first_t)
    log.debug(dt)
    start_t = util.timestamp(dt)
    log.debug(start_t)

    

    # get earliest t
    # floor it to midnight
    # step through each resolution
    # take the first one
    # keeping popping until t is crossed

    pass