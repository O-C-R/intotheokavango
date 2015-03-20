import geojson, datetime, pytz, json
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
        # expecting bounds (upper left (NW), lower right (SE)): lon_1,lat_1,lon_2,lat_2
        # oka: 20,-17,26,-22 nyc: -75,41,-71,40
        geo_bounds = self.get_argument('geoBounds', None)
        if geo_bounds:
            lon_1, lat_1, lon_2, lat_2 = [float(coord) for coord in geo_bounds.split(',')]
            log.debug("geo_bounds %f,%f %f,%f" % (lon_1, lat_1, lon_2, lat_2))
            search['geometry'] = {'$geoWithin': {'$geometry': {'type': "Polygon", 'coordinates': [[ [lon_1, lat_1], [lon_2, lat_1], [lon_2, lat_2], [lon_1, lat_2], [lon_1, lat_1] ]]}}}

        # get all the rest of the arguments and format as properties    
        try:
            for param, value in self.request.arguments.items():
                for i, item in enumerate(value):
                    item = item.decode('utf-8')
                    item = strings.as_numeric(item)
                    value[i] = item
                search[param] = value[0] if len(value) == 1 else value  
            search = {('properties.%s' % (strings.camelcase(param) if param != 't_utc' else 't_utc') if param != 'geometry' else param): value for (param, value) in search.items() if param != 'geoBounds' and param != 'startDate' and param != 'endDate'}
        except Exception as e:
            log.error(log.exc(e))
            return self.error("bad parameters")

        # http://localhost:9999/api?geoBounds=20,-17,26,-22&startDate=2014-08-01&endDate=2014-09-01&Member=Jer
        log.info("SEARCH %s" % search)

        try:
            result = self.db.features.find(search).sort('t_utc')
            print(json.dumps(result.explain(), indent=4))
            features = geojson.FeatureCollection([fix_id(feature) for feature in result])
        except Exception as e:
            return self.error(log.exc(e))

        log.info("Returning %s features" % len(features['features']))
        return self.json(features)

def fix_id(feature):
    feature['id'] = feature['_id']
    del feature['_id']
    return feature