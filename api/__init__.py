import geojson, datetime, pytz, json, os, importlib, datetime
from housepy import server, config, log, util, strings
from mongo import ASCENDING, DESCENDING, ObjectId

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
    - region (arbitrary polygon)

    Can also do expeditionDay=N for the 24 hour period N days after the expedition start date specified in the config

    By default, returns the first 100 results. limit=N for more. 
    Sorted in ascending order by t_utc. To reverse, use order=descending.
    Returns only one feature for every resolution seconds.

"""

class Api(server.Handler):

    def post(self, nop=None):
        return self.not_found()

    def get(self, view_name=None, output=None):

        # add a header for unrestricted access
        self.set_header("Access-Control-Allow-Origin", "*")
        csv = False

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
            if output == "csv":
                csv = True
            else:
                feature_type = self.get_argument('FeatureType', None)
                try:
                    return self.render("api/%s.html" % output, query=(self.request.uri).replace("/%s" % output, ""), feature_type=feature_type)
                except Exception as e:
                    return self.error("Could not render %s" % output)

        # time to build our search filter
        search = {}

        # special parsing for id
        feature_id = self.get_argument('id', None)
        if feature_id is not None:
            try:
                search['_id'] = ObjectId(feature_id)
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad dates")          

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

        # special parsing for rectangular location
        # expecting bounds (upper left (NW), lower right (SE)): lon_1,lat_1,lon_2,lat_2
        # oka: 20,-17,26,-22 nyc: -75,41,-71,40
        geo_bounds = self.get_argument('geoBounds', None)
        if geo_bounds is not None:
            try:
                lon_1, lat_1, lon_2, lat_2 = [float(coord) for coord in geo_bounds.split(',')]
                log.debug("geo_bounds %f,%f %f,%f" % (lon_1, lat_1, lon_2, lat_2))
                search['geometry'] = {'$geoWithin': {'$geometry': {'type': "Polygon", 'coordinates': [[ [lon_1, lat_1], [lon_2, lat_1], [lon_2, lat_2], [lon_1, lat_2], [lon_1, lat_1] ]]}}}
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad geometry")

        # special parsing for polygonal region
        # expecting an arbitrary polygon
        # (rough) mombo: 22.731580,-19.186571,22.716444,-19.227478,22.766600,-19.295694,22.827821,-19.319120,22.874635,-19.336678,22.948241,-19.282060,22.747431,-19.132026
        region = self.get_argument('region', None)
        if region is not None:
            try:
                cs = [float(coord) for coord in region.split(',') if len(coord)]
                coords = list(zip(cs[::2], cs[1::2]))
                if coords[0] != coords[-1]:
                    coords.append(coords[0])
                log.debug("region %s" % (coords))
                search['geometry'] = {'$geoWithin': {'$geometry': {'type': "Polygon", 'coordinates': [coords]}}}
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad geometry")

        # special parsing for expeditionDay (overrides startDate / endDate)
        expedition_day = self.get_argument('expeditionDay', None)
        if expedition_day is not None:
            try:
                expedition = self.get_argument('expedition', config['expedition'])
                expedition = self.get_argument('Expedition', expedition)
                start_dt = util.parse_date(str(config['start_date'][expedition]), tz=config['local_tz'])
                expedition_day = int(expedition_day) - 1
                log.debug("%s days after %s" % (expedition_day, start_dt))
                gt_t = util.timestamp(start_dt + datetime.timedelta(days=expedition_day))
                lt_t = util.timestamp(start_dt + datetime.timedelta(days=expedition_day + 1))
                search['t_utc'] = {'$gt': gt_t, '$lt': lt_t}
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad day")

        # special parsing for resolution
        resolution = strings.as_numeric(self.request.arguments['resolution'][0]) if 'resolution' in self.request.arguments else 0

        # special parsing for SpeciesSearch
        species_search = self.get_argument('speciesSearch', None)
        if species_search is not None:
            search['$text'] = {'$search': species_search}

        # get limit and order
        # limit = self.get_argument('limit', 100) # this fails on int arguments, which I think is a tornado bug
        limit = strings.as_numeric(self.request.arguments['limit'][0]) if 'limit' in self.request.arguments else 100
        order = self.request.arguments['order'][0].lower() if 'order' in self.request.arguments else 'ascending'
        order = ASCENDING if order == "ascending" else DESCENDING

        # get all the rest of the arguments and format as properties    
        try:
            for param, value in self.request.arguments.items():
                for i, item in enumerate(value):
                    item = item.decode('utf-8')
                    item = strings.as_numeric(item)
                    item = True if type(item) == str and item.lower() == "true" else item
                    item = False if type(item) == str and item.lower() == "false" else item
                    item = {'$exists': True} if item == '*' else item
                    value[i] = item
                search[param] = value[0] if len(value) == 1 else value  
            search = {  ('properties.%s' % (strings.camelcase(param) if param != 't_utc' and param != '_id' else param) if param != 'geometry' and param != '$text' and param != '_id' else param): value for (param, value) in search.items() if param not in ['id', 'region', 'geoBounds', 'startDate', 'endDate', 'expeditionDay', 'limit', 'order', 'resolution', 'speciesSearch']}
            print(search)
        except Exception as e:
            log.error(log.exc(e))
            return self.error("bad parameters")

        # http://localhost:7777/api?geoBounds=20,-17,26,-22&startDate=2014-08-01&endDate=2014-09-01&Member=Jer
        log.info("FILTER %s" % search)

        # pass our search to the view module for execution and formatting
        try:         
            result = view.assemble(self, search, limit, order, resolution)   
            if result is None:
                return
            if csv:
                return self.csv(format_csv(result), "data.csv")
            results, total, returned = result
            search = {key.replace('properties.', ''): value for (key, value) in search.items()}
            return self.json({'order': order, 'limit': limit, 'total': total, 'returned': len(results) if returned is None else returned, 'filter': search, 'results': results, 'resolution': resolution if resolution != 0 else "full"})
        except Exception as e:
            return self.error(log.exc(e))

def format_csv(data):
    import csv    
    features = data[0]['features']

    # build header
    header = []
    for feature in features:
        feature.update(feature['properties'])
        if 'Taxonomy' in feature and feature['Taxonomy'] is not None:
            feature.update(feature['Taxonomy'])
            del feature['Taxonomy']
        if feature['geometry'] is not None:
            feature.update({"Longitude": feature['geometry']['coordinates'][0], "Latitude": feature['geometry']['coordinates'][1]})
        del feature['properties']
        del feature['geometry']
        for key in feature:            
            if key not in header:
                header.append(key)
    header.sort()
    log.debug(header)

    # populate rows
    csv = []
    csv.append(','.join(header))
    with open('data.csv', 'w', newline='') as csvfile:
        for feature in features:
            row = []
            for column in header:
                if column in feature:
                    value = feature[column]
                    if type(value) == str:
                        value = strings.singlespace(value)
                        value.replace('"', "'")
                        value = "%s" % value
                    row.append(str(value).replace(",", ""))
                else:
                    row.append("None")
            csv.append(','.join(row))
    return '\n'.join(csv)

    # print(json.dumps(features, indent=4, default=lambda x: str(x)))