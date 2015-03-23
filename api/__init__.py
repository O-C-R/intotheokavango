import geojson, datetime, pytz, json, os, importlib
from housepy import server, config, log, util, strings

"""
    Basically, it's like this: /api/<view>/<output>?<query>

    The view is what kind of thing you want back (eg, a FeatureCollection (features), or a list of expeditions)
    The output is json if it's missing, otherwise, how about a map? or HTML? a chart?
    See templates/api/map.html for an example of how to subsequently load the JSON data asyncronously

    The query defines the filter. This might be any property at all, but keyed ones are:
    - Expedition (eg okavango_14)
    - Member (eg Jer)
    - startDate and endDate (endDate is one day later if omitted and startDate is present)
    - geoBounds (upper left (NW), lower right (SE): lon_1,lat_1,lon_2,lat_2. So Okavango is something like 20,-17,26,-22

    By default, returns the first 100 results. limit=N for more.

"""

class Api(server.Handler):

    def post(self, nop=None):
        return self.not_found()

    def get(self, view_name=None, output=None):

        # do the routing and load view module
        if not len(view_name):
            log.info("Listing views...")
            views = ["/api/%s" % filename.split('.')[0] for filename in os.listdir(os.path.abspath(os.path.dirname(__file__))) if filename[0] != "_" and filename[-3:] == ".py"]
            response = {'description': "API view endpoints", "views": views}
            return self.json(response)
        module_name = "api.%s" % view_name
        try:
            view = importlib.import_module(module_name)
            log.info("Loaded %s module" % module_name)
        except ImportError as e:
            log.error(log.exc(e))
            return self.error("View \"%s\" not recognized" % view_name)
        if len(output):
            try:
                return self.render("api/%s.html" % output, query=(self.request.uri).replace("/%s" % output, ""))
            except Exception as e:
                return self.error("Could not render %s" % output)

        # time to build our search filter
        search = {}

        # special parsing for startDate and endDate
        start_string = self.get_argument('startDate', None) 
        if start_string is not None:
            try:            
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
        if geo_bounds is not None:
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
            search = {('properties.%s' % (strings.camelcase(param) if param != 't_utc' else 't_utc') if param != 'geometry' else param): value for (param, value) in search.items() if param != 'geoBounds' and param != 'startDate' and param != 'endDate' and param != 'limit'}
        except Exception as e:
            log.error(log.exc(e))
            return self.error("bad parameters")

        # http://localhost:9999/api?geoBounds=20,-17,26,-22&startDate=2014-08-01&endDate=2014-09-01&Member=Jer
        log.info("SEARCH %s" % search)

        # pass our search to the view module for execution and formatting
        try:
            return view.assemble(self, search)
        except Exception as e:
            return self.error(log.exc(e))
