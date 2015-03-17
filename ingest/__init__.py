import importlib, os, json
from housepy import config, log, server, util

class Ingest(server.Handler):

    def get(self, page=None):
        return self.not_found()        

    def post(self, kind=None):
        log.info("Ingest.post %s" % kind)
        if kind is None or not len(kind):
            kind = self.get_argument("kind", "") # if we didn't use an endpoint, check if it's in the variables
        module_name = "ingest.%s" % kind
        try:
            module = importlib.import_module(module_name)
            feature = module.parse(self.request)
        except ImportError as e:
            log.error(log.exc(e))
            return self.error("Kind \"%s\" not recognized" % kind)
        if not feature:
            return self.error("Ingest failed")
        feature = check_geo(feature)
        if 't_utc' not in feature:
            self.error("Missing timestamp")
        feature.update({'expedition': config['expedition'] if 'expedition' not in feature else feature['expedition'], 'kind': kind, 't_created': util.timestamp(ms=True)})
        log.debug(feature)
        feature_id = self.db.features.insert_one(feature).inserted_id
        return self.text(feature_id)


def check_geo(data):
    lat, lon, alt = 0, 0, 0
    delete = []
    try:
        for param in data:
            if param.lower().strip() == 'longitude' or param.lower().strip() == 'lon' or param.lower().strip() == 'lng':
                lon = data[param]
                delete.append(param)
            elif param.lower().strip() == 'latitude' or param.lower().strip() == 'lat':    
                lat = data[param]
                delete.append(param)
            elif param.lower().strip() == 'altitude' or param.lower().strip() == 'alt':    
                alt = data[param]
                delete.append(param)
        if lat and lon:
            for param in delete:
                del data[param]
            data.update({'geo': [float(lat), float(lon), float(alt)]})
    except Exception as e:
        log.error("Error parsing coordinates: %s" % log.exc(e))
    return data


def json_ingest(request):
    """Generic method for ingesting a JSON file"""
    log.info("ingest.json_ingest")
    filename = save_file(request)    
    try:
        with open(filename) as f:
            data = json.loads(f.read())
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data        

def save_file(request):
    for key, fileinfo in request.files.items():
        fileinfo = fileinfo[0]
        filename = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "%s_%s" % (util.timestamp(), fileinfo['filename'])))
        with open(filename, 'wb') as f:
            f.write(fileinfo['body'])
        return filename


