from housepy import server, config, log, util, strings
from ingest import check_geo

class Api(server.Handler):

    def post(self, nop=None):
        return self.not_found()

    def get(self, page=None): # take as many as necessary

        # basically, request vars can directly correlate to a document for search
        search = self.request.arguments
        for param, value in search.items():
            for i, item in enumerate(value):
                value[i] = strings.as_numeric(item)
            search[param] = value[0] if len(value) == 1 else value
        search = check_geo(search)


        ## have a geo range syntax (bounds?)
        ## have a temporal range syntax
        ## filter by current expedition if none provided

        # posts.find({"date": {"$lt": d}}).sort("author").explain()["cursor"]

        features = db.features.find(search).sort('t_utc')
        for feature in features:
            pass
            # convert to geojson

        return self.text("OK")
