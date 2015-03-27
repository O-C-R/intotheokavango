import geojson
from pymongo import ASCENDING, DESCENDING
from housepy import config, log

def assemble(self, search):
    log.info("features.assemble")
    # limit = self.get_argument('limit', 100) # this fails on int arguments, which I think is a tornado bug
    limit = self.request.arguments['limit'][0] if 'limit' in self.request.arguments else 100
    order = self.request.arguments['order'][0].lower() if 'order' in self.request.arguments else 'ascending'
    order = ASCENDING if order == "ascending" else DESCENDING
    try:
        results = self.db.features.find(search).limit(limit).sort([('properties.t_utc', order)])
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