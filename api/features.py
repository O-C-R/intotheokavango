import geojson
from housepy import config, log

def assemble(self, search):
    log.info("features.assemble")
    limit = self.get_argument('limit', 100)
    try:
        result = self.db.features.find(search).limit(limit).sort('t_utc')
        # log.debug(json.dumps(result.explain(), indent=4))
        features = geojson.FeatureCollection([fix_id(feature) for feature in result])
    except Exception as e:
        return self.error(log.exc(e))
    log.info("Found %s features" % len(features['features']))
    return self.json(features)

def fix_id(feature):
    feature['id'] = feature['_id']
    del feature['_id']
    return feature