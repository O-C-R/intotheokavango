import importlib, os, json, tornado, json, shutil, uuid, os
from PIL import ExifTags, Image
from housepy import config, log, server, util, strings
from housepy.server import Application

"""
    Ingestion is forgiving and will accept and reformat flat JSON.
    Everything in the database is enforced as a valid GeoJSON Feature
    with the addition of the following fields in its properties:
        - Expedition (eg okavango_15)
        - FeatureType (string delineating what kind of feature it is)
        - Member (who collected the data, human or otherwise)
        - t_utc (UTC timestamp) and derived DateTime (set to local_tz, in the format "%Y-%m-%dT%H:%M:%S%z")        
    Each of these is indexed in the database.
    Other properties should be camelcased with uppercase first letter (enforced).
    The ingestion endpoints hit the appropriate submodule, which is responsible
    for parsing whatever input into a dictionary with a valid t_utc and
    hopefully good style.

    Geo note: if there is no geometry included in a feature, the system will attempt to estimate one.
    It does this by looking for the closest features temporally on either end and making a weighted average.
    The geo_estimator processors will do this repeatedly until ambit data is used, presumably the most accurate.

"""

class Ingest(server.Handler):

    def get(self, page=None):
        return self.not_found()        

    def post(self, feature_type=None):
        log.info("Ingest.post %s" % feature_type)
        self.set_header("Access-Control-Allow-Origin", "*")                
        if feature_type is None or not len(feature_type):
            feature_type = self.get_argument("FeatureType", "") # if we didn't use an endpoint, check if it's in the variables
        feature_type = feature_type.lower().split('.')[0].strip()
        success, value = ingest_request(feature_type, self.request)
        if success:
            return self.text("SUCCESS") if feature_type != "sensor" else self.finish() ## supressing output for twilio
        else:
            return self.error(value)

def ingest_request(feature_type, request):
    log.info("ingest_request")
    module_name = "ingest.%s" % feature_type
    try:
        module = importlib.import_module(module_name)
        log.info("--> loaded %s module" % module_name)
        result = module.parse(request)
        if type(result) == tuple and len(result) == 2:
            feature, error = result
        else:
            feature = result
            error = "Ingest failed"
    except ImportError as e:
        log.error(log.exc(e))
        return False, "FeatureType \"%s\" not recognized" % feature_type
    if not feature:
        return False, error
    return ingest_data(feature_type, feature)

def ingest_data(feature_type, feature): # note that this operates on the original datastructure
    log.info("ingest_data")  
    try:
        db = Application.instance.db
    except AttributeError:
        from mongo import db
    feature = verify_geojson(feature)
    if not feature:
        return False, "Could not format as geojson"
    feature = verify_t(feature)    
    if not feature:
        return False, "Missing t_utc"
    feature = verify_expedition(feature)
    feature = tag_core(feature)        
    feature = verify_geometry(feature)
    if feature['geometry'] is None:
        feature = estimate_geometry(feature, db)
    feature['properties'].update({'Expedition': config['expedition'] if 'Expedition' not in feature['properties'] else feature['properties']['Expedition'], 'FeatureType': feature_type if 'FeatureType' not in feature['properties'] else feature['properties']['FeatureType'], 't_created': util.timestamp(ms=True)})
    try:
        feature_id = db.features.insert_one(feature).inserted_id
    except Exception as e:
        log.error(log.exc(e))
        return False, "Database error"
    log.info("--> success (%s)" % feature_id)
    return True, feature_id

def verify_geojson(data):
    """Verify or reformat JSON as GeoJSON"""
    """Enforces camelcasing of properties"""
    if 'id' in data:
        del data['id']
    try:
        data['type'] = data['type'] if 'type' in data else "Feature"
        data['geometry'] = data['geometry'] if 'geometry' in data else None
        if 'properties' not in data:
            data['properties'] = {}
        for key, value in {key: value for (key, value) in data.items() if key not in ['type', 'geometry', 'properties']}.items():
            data['properties'][key] = strings.as_numeric(value)
        data = {'type': data['type'], 'geometry': data['geometry'], 'properties': data['properties']}                
        for key, value in data['properties'].items():
            fixed_key = strings.camelcase(key) if key != 't_utc' else key
            fixed_key = "pH" if fixed_key == "Ph" else fixed_key
            data['properties'][fixed_key] = strings.as_numeric(value)
            if key != fixed_key:                
                del data['properties'][key]
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data

def verify_geometry(data):
    """Verify or reformat geometry data"""
    lon, lat, alt = None, None, None
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
        if lon is not None and lat is not None:
            if data['geometry'] is None:    ## this retains geometry if it exists, is that ok?
                data['geometry'] = {'type': "Point", 'coordinates': [float(lon), float(lat), float(alt) if alt is not None else None]}
            for p in delete:
                del properties[p]
            data['properties'] = properties    

        ### temporarily ditch altitude prior to mongo 3.2.0
        if 'geometry' in data and data['geometry'] is not None:
            if len(data['geometry']['coordinates']) == 3:
                data['properties']['Altitude'] = data['geometry']['coordinates'][2]
            data['geometry']['coordinates'] = data['geometry']['coordinates'][:2] 

    except Exception as e:
        log.error("Error parsing coordinates: %s" % log.exc(e))
    return data

def estimate_geometry(data, db):
    """Estimate the location of a geotagged object for a new feature that's missing it"""
    """For data tagged to a Member, find something else that's geotagged with that Member, best case ambit_geo, worst case take the beacon if they are core, otherwise fail"""
    """For non-member data, just tag it to the beacon"""
    log.info("Estimating geometry...")
    t = data['properties']['t_utc']
    log.info("--> t is %s" % t)
    try:

        # find geodata from this Member
        member_closest_before = None
        member_closest_after = None
        core = False
        if 'Member' in data['properties'] and data['properties']['Member'] is not None:
            member = data['properties']['Member']
            log.info("--> member is %s" % member)
            try:
                member_closest_before = list(db.features.find({'properties.Member': member, 'geometry': {'$ne': None}, 'properties.t_utc': {'$lte': t}, 'properties.EstimatedGeometry': {'$exists': False}}).sort('properties.t_utc', -1).limit(1))[0]
                member_closest_after =  list(db.features.find({'properties.Member': member, 'geometry': {'$ne': None}, 'properties.t_utc': {'$gte': t}, 'properties.EstimatedGeometry': {'$exists': False}}).sort('properties.t_utc', 1).limit(1))[0]
            except IndexError:
                pass

            # is/was the member core at this point?
            try:
                core = list(db.members.find({'Name': member, 't_utc': {'$lte': t}}).sort('properties.t_utc', -1).limit(1))[0]['Core']
            except Exception as e:
                log.info("--> no core entry at time %s" % t)

        # find geodata from the nearest beacon
        # but only do it if there is no Member, or the Member is/was core at that point
        core_sat = config['satellites'][0] # first satellite is core expedition
        beacon_closest_before = None
        beacon_closest_after = None
        if 'Member' not in data['properties'] or core:
            try:
                beacon_closest_before = list(db.features.find({'$or': [{'properties.t_utc': {'$lte': t}, 'properties.FeatureType': 'beacon', 'properties.Satellite': {'$exists': False}}, {'properties.t_utc': {'$lte': t}, 'properties.FeatureType': 'beacon', 'properties.Satellite': {'$eq': core_sat}}]}).sort('properties.t_utc', -1).limit(1))[0]
                beacon_closest_after = list(db.features.find({'$or': [{'properties.t_utc': {'$gte': t}, 'properties.FeatureType': 'beacon', 'properties.Satellite': {'$exists': False}}, {'properties.t_utc': {'$gte': t}, 'properties.FeatureType': 'beacon', 'properties.Satellite': {'$eq': core_sat}}]}).sort('properties.t_utc', 1).limit(1))[0]
            except IndexError:
                pass

        # pick the best ones
        if member_closest_before is not None and beacon_closest_before is not None:
            closest_before = beacon_closest_before if beacon_closest_before['properties']['t_utc'] > member_closest_before['properties']['t_utc'] else member_closest_before
        elif member_closest_before is not None:
            closest_before = member_closest_before
        else:
            closest_before = beacon_closest_before

        if member_closest_after is not None and beacon_closest_after is not None:
            closest_after = beacon_closest_after if beacon_closest_after['properties']['t_utc'] < member_closest_after['properties']['t_utc'] else member_closest_after
        elif member_closest_after is not None:
            closest_after = member_closest_after
        else:
            closest_after = beacon_closest_after

        if closest_before is None or closest_after is None:
            data['properties']['EstimatedGeometry'] = None
            log.warning("--> closest not found")
            return data

        # average the times and positions: this is naive calculation not taking projection into account
        data['geometry'] = closest_before['geometry'] # make sure the fields are there (if theres an error it will default to this assignment)
        data['properties']['EstimatedGeometry'] = closest_before['properties']['FeatureType']   # note what we used

        t1 = closest_before['properties']['t_utc']
        t2 = closest_after['properties']['t_utc']
        if t1 != t2:
            p = (t - t1) / (t2 - t1)
            data['geometry']['coordinates'][0] = (closest_before['geometry']['coordinates'][0] * (1 - p)) + (closest_after['geometry']['coordinates'][0] * p)
            data['geometry']['coordinates'][1] = (closest_before['geometry']['coordinates'][1] * (1 - p)) + (closest_after['geometry']['coordinates'][1] * p)
        # log.debug(data['geometry']['coordinates'])

        ## ignoring altitude

        log.info("--> derived from %s" % data['properties']['EstimatedGeometry'])

    except Exception as e:
        log.error(log.exc(e))
    return data

def verify_t(data):
    """Verify or reformat temporal data -- t_utc is expected from all parse methods"""
    if 't_utc' not in data['properties']:
        return None
    data['properties']['DateTime'] = util.datestring(data['properties']['t_utc'], tz=config['local_tz'])    
    return data

def verify_expedition(data):
    """Verify we have an Expedition and Member property"""
    for wrong in ['TeamMember', 'teamMember', 'Person', 'person', 'member']:
        if wrong in data['properties']:
            if 'Member' not in data['properties']:
                data['properties']['Member'] = data['properties'][wrong]
            del data['properties'][wrong]
    for wrong in ['expedition']:
        if wrong in data['properties']:
            data['properties']['Expedition'] = data['properties'][wrong]
            del data['properties'][wrong]
    if 'Member' not in data['properties']:
        data['properties']['Member'] = None
    if data['properties']['Member'] is not None:
        data['properties']['Member'] = data['properties']['Member'].title() if len(data['properties']['Member']) > 2 else data['properties']['Member'].upper()
        data['properties']['Member'] = data['properties']['Member'].replace('\u00f6', 'o') # sorry Gotz
    if 'Expedition' not in data['properties']:
        data['properties']['Expedition'] = config['expedition']
    return data

def tag_core(data):
    try:
        db = Application.instance.db
    except AttributeError:
        from mongo import db    
    try:
        member = data['properties']['Member']   
        t = data['properties']['t_utc']   
        try:
            core = list(db.members.find({'Name': member, 't_utc': {'$lte': t}}).sort('properties.t_utc', -1).limit(1))[0]['Core']
        except IndexError:
            log.info("--> no core entry at time %s" % t)
            core = False
        data['properties']['CoreExpedition'] = core
        return data
    except Exception as e:
        log.error(log.exc(e))
        return data

def ingest_json_file(request):
    """Generic method for ingesting a JSON file"""
    path = save_file(request)    
    try:
        with open(path) as f:
            data = json.loads(f.read())
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data      

def ingest_json_body(request):
    """Generic method for ingesting a JSON in the body of the post"""
    log.info(request.body)
    try:
        data = json.loads(str(request.body, encoding='utf-8'))
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data      

def ingest_plain_body(request):
    """Generic method for ingesting the body of the post"""
    try:
        content = str(request.body, encoding='utf-8')
    except Exception as e:
        log.error(log.exc(e))
        return None
    return content      

def ingest_form_vars(request):
    """Generic method for ingesting POST data in form format"""
    data = {}
    for param, value in request.arguments.items():
        for i, item in enumerate(value):
            item = item.decode('utf-8')
            item = strings.as_numeric(item)
            value[i] = item
        data[param] = value[0] if len(value) == 1 else value
    return data

def save_files(request):
    log.info("ingest.save_files")
    paths = []    
    try:
        for key, fileinfo in request.files.items():
            fileinfo = fileinfo[0]
            path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", "%s_%s" % (util.timestamp(), fileinfo['filename'])))
            with open(path, 'wb') as f:
                f.write(fileinfo['body'])
                log.info("--> saved %s" % path)
            paths.append(path)
    except Exception as e:
        log.error(log.exc(e))
    return paths

def save_file(request):
    files = save_files(request)
    if len(files):
        return files[0]
    else:
        return None

def process_image(path, member=None, t_utc=None):
    # try to get EXIF data
    data = {}
    if member is not None:
        data['Member'] = member
    if t_utc is not None:
        data['t_utc'] = t_utc
    try:    
        image = Image.open(path)  
        width, height = image.size
        data['Dimensions'] = width, height
        try:
            exif = {ExifTags.TAGS[k]: v for (k, v) in image._getexif().items() if k in ExifTags.TAGS}
        except AttributeError:
            log.error("--> no EXIF data in image")
        else:
            # log.debug(json.dumps(exif, indent=4, default=lambda x: str(x)))
            date_field = exif['DateTimeOriginal'] if 'DateTimeOriginal' in exif else exif['DateTime']
            if date_field[4] == ":" and date_field[7] == ":":
                date_field = list(date_field)
                date_field[4] = "-"
                date_field[7] = "-"
                date_field = ''.join(date_field)
            date = util.parse_date(date_field, tz=config['local_tz'])
            data['t_utc'] = util.timestamp(date)                            ## careful about this overriding
            data['DateTime'] = util.datestring(data['t_utc'], tz=config['local_tz'])    
            data['Make'] = exif['Make'].replace("\u0000", '').strip() if 'Make' in exif else None
            data['Model'] = exif['Model'].replace("\u0000", '').strip() if 'Model' in exif else None
        filename = "%s_%s.jpg" % (data['t_utc'], str(uuid.uuid4()))
        new_path = os.path.join(os.path.dirname(__file__), "..", "static", "data", "images", filename)
        shutil.copy(path, new_path)
        data['Url'] = "/static/data/images/%s" % filename
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data