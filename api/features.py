import geojson
from housepy import config, log

def assemble(self, search, limit, order):
    log.info("features.assemble")
    try:
        results = self.db.features.find(search).sort([('properties.t_utc', order)]).limit(limit)
        # log.debug(json.dumps(result.explain(), indent=4))
        features = geojson.FeatureCollection([fix_id(feature) for feature in results])
    except Exception as e:
        return self.error(log.exc(e))
    log.info("Found %s features" % len(features['features']))
    return self.json(features)

def fix_id(feature):
    feature['id'] = feature['_id']
    del feature['_id']
    return feature