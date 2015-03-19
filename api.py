import geojson
from housepy import server, config, log, util, strings
# from ingest import check_geo

class Api(server.Handler):

    def post(self, nop=None):
        return self.not_found()

    def get(self, page=None): # take as many as necessary

        ## extract geo and t queries out of this

        try:
            search = self.request.arguments
            for param, value in search.items():
                for i, item in enumerate(value):
                    item = item.decode('utf-8')
                    item = strings.as_numeric(item)
                    value[i] = item
                search[param] = value[0] if len(value) == 1 else value            
            search = {"properties.%s" % param: value for (param, value) in search.items()}
            # search = check_geo(search)
            log.info("SEARCH %s" % search)
        except Exception as e:
            log.error(log.exc(e))
            return self.error("bad parameters")

        ## have a geo range syntax (bounds?)
        ## have a temporal range syntax
        ## filter by current expedition if none provided

        # posts.find({"date": {"$lt": d}}).sort("author").explain()["cursor"]

        try:
            features = self.db.features.find(search).sort('t_utc') # when does the query happen?
            result = geojson.FeatureCollection([fix_id(feature) for feature in features])
        except Exception as e:
            return self.error(log.exc(e))

        return self.json(result)

def fix_id(feature):
    feature['id'] = feature['_id']
    del feature['_id']
    return feature