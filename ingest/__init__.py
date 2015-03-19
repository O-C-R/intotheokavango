import importlib, os, json
from housepy import config, log, server, util, strings

"""
    Ingestion is forgiving and will accept and reformat flat JSON.
    Everything in the database is enforced as a valid GeoJSON Feature
    with the addition of the following fields in its properties:
        - expedition (eg okavango_15)
        - t_utc (UTC timestamp)
        - DateTime (set to local_tz)
        - kind (string delineating what kind of feature it is)
    Each of these is indexed in the database.

"""

class Ingest(server.Handler):

    def get(self, page=None):
        return self.not_found()        

    def post(self, kind=None):
        log.info("Ingest.post %s" % kind)
        if kind is None or not len(kind):
            kind = self.get_argument("kind", "") # if we didn't use an endpoint, check if it's in the variables
        kind = kind.lower().split('.')[0].strip()
        module_name = "ingest.%s" % kind
        try:
            module = importlib.import_module(module_name)
            feature = module.parse(self.request)
        except ImportError as e:
            log.error(log.exc(e))
            return self.error("Kind \"%s\" not recognized" % kind)
        if not feature:
            return self.error("Ingest failed")
        feature = verify_geojson(feature)
        feature = verify_geometry(feature)
        feature = verify_t(feature)
        feature['properties'].update({'expedition': config['expedition'] if 'expedition' not in feature else feature['expedition'], 'kind': kind, 't_created': util.timestamp(ms=True)})
        log.debug(feature)
        feature_id = self.db.features.insert_one(feature).inserted_id
        return self.text(str(feature_id))

def ingest_json(request):
    """Generic method for ingesting a JSON file"""
    log.info("ingest.ingest_json")
    filename = save_file(request)    
    try:
        with open(filename) as f:
            data = json.loads(f.read())
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data        

def verify_geojson(data):
    """Verify or reformat JSON as GeoJSON"""
    if 'id' in data:
        del data['id']
    try:
        data['type'] = data['type'] if 'type' in data else "Feature"
        data['geometry'] = data['geometry'] if 'geometry' in data else None
        data['properties'] = {key: strings.as_numeric(value) for (key, value) in data['properties'].items()} if 'properties' in data else {}
        for key, value in {key: value for (key, value) in data.items() if key not in ['type', 'geometry', 'properties']}:
            data['properties'][key] = strings.as_numeric(value)
        data = {'type': data['type'], 'geometry': data['geometry'], 'properties': data['properties']}                
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data

def verify_geometry(data):
    """Verify or reformat geometry data"""
    lat, lon, alt = 0, 0, 0
    properties = data['properties']
    delete = []
    try:
        for p, value in properties.items():
            if p.lower().strip() == 'longitude' or p.lower().strip() == 'lon' or p.lower().strip() == 'lng':
                lon = value
                delete.append(p)
            elif p.lower().strip() == 'latitude' or p.lower().strip() == 'lat':    
                lat = value
                delete.append(p)
            elif p.lower().strip() == 'altitude' or p.lower().strip() == 'alt':    
                alt = value
                delete.append(p)
        if lat and lon:
            if 'geometry' not in data:
                data['geometry'] = {'type': "Point", 'coordinates': [float(lon), float(lat), float(alt)]}
            for p in delete:
                del properties[p]
            data['properties'] = properties     

        ### temporarily ditch altitude prior to mongo 3.1.0
        if 'geometry' in data:
            data['geometry']['coordinates'] = data['geometry']['coordinates'][:2] 

    except Exception as e:
        log.error("Error parsing coordinates: %s" % log.exc(e))
    return data

def verify_t(data):
    """Verify or reformat temporal data"""
    return data

def save_file(request):
    for key, fileinfo in request.files.items():
        fileinfo = fileinfo[0]
        filename = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "%s_%s" % (util.timestamp(), fileinfo['filename'])))
        with open(filename, 'wb') as f:
            f.write(fileinfo['body'])
        return filename


