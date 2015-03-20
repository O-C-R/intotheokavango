import geojson, datetime, pytz
from housepy import server, config, log, util, strings
# from ingest import check_geo

class Api(server.Handler):

    def post(self, nop=None):
        return self.not_found()

    def get(self, page=None): # take as many as necessary
        if page == "map":
            return self.render("api/map.html", query=self.request.query)

        search = {}

        # special parsing for startDate and endDate
        start_string = self.get_argument('startDate', None) 
        if start_string:
            try:            
                print(start_string)
                start_dt = util.parse_date(start_string, tz=config['local_tz'])
                start_t = util.timestamp(start_dt)        
                end_string = self.get_argument('endDate', (start_dt + datetime.timedelta(days=1)).strftime("%Y-%m-%d"))
                end_dt = util.parse_date(end_string, tz=config['local_tz'])
                end_t = util.timestamp(end_dt)        
                log.debug("startDate %s" % start_dt)            
                log.debug("endDate %s" % end_dt)    
                search['t_utc'] = {'$gt': start_t, '$lt': end_t}
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad dates")          

        # special parsing for location
        ## pass  

        # get all the rest of the arguments and format as properties    
        try:
            for param, value in self.request.arguments.items():
                for i, item in enumerate(value):
                    item = item.decode('utf-8')
                    item = strings.as_numeric(item)
                    value[i] = item
                search[param] = value[0] if len(value) == 1 else value  
            search = {"properties.%s" % param: value for (param, value) in search.items() if param != 'location' and param != 'startDate' and param != 'endDate'}
        except Exception as e:
            log.error(log.exc(e))
            return self.error("bad parameters")

        log.info("SEARCH %s" % search) 
        ## filter by current expedition if none provided?

        try:
            result = self.db.features.find(search).sort('t_utc')
            features = geojson.FeatureCollection([fix_id(feature) for feature in result])
        except Exception as e:
            return self.error(log.exc(e))

        log.info("Returning %s features" % len(features['features']))
        return self.json(features)

def fix_id(feature):
    feature['id'] = feature['_id']
    del feature['_id']
    return feature