import json, shutil, uuid, os
from housepy import log, util, config
from PIL import ExifTags, Image
from ingest import save_file, ingest_json_body, ingest_form_vars

def parse(request):
    log.info("image.parse")
    path = save_file(request) 
    if path is None:
        return None

    # try to get EXIF data
    try:    
        image = Image.open(path)        
        exif = {ExifTags.TAGS[k]: v for (k, v) in image._getexif().items() if k in ExifTags.TAGS}
        # log.debug(json.dumps(exif, indent=4, default=lambda x: str(x)))
        date_field = exif['DateTime']
        if date_field[4] == ":" and date_field[7] == ":":
            date_field = list(date_field)
            date_field[4] = "-"
            date_field[7] = "-"
            date_field = ''.join(date_field)
        date = util.parse_date(date_field, tz=config['local_tz'])
        t_utc = util.timestamp(date)
        log.debug(date)
    except Exception as e:
        log.error(log.exc(e))
        return None

    data = ingest_json_body(request)
    if data is None:
        log.debug("JSON body failed, trying arguments...")
        data = ingest_form_vars(request)
        print(data)
        if 'Member' not in data:
            return None    

    filename = "%s_%s.jpg" % (t_utc, str(uuid.uuid4()))
    new_path = os.path.join(os.path.dirname(__file__), "..", "static", "data", "images", filename)
    shutil.copy(path, new_path)
    url = "/static/data/images/%s" % filename

    data['FeatureType'] = "image"
    data['url'] = url
    data['t_utc'] = t_utc

    log.debug(data)

    return data

"""
    log.info("ingest_image %s" % path)

    file_name = path.split('/')[-1]
    file_name = file_name.split('.')[0]
    front = 'img'


    if ('_'  in file_name):
        front = file_name.split('_')[0]
        date_string = file_name.split('_')[1]
    else:
        date_string = file_name
    
    log.info("ingest_image %s" % date_string)
    #060814154100
    dt = datetime.datetime.strptime(date_string.split('_')[0], "%d%m%y%H%M%S")
    log.info("datetime %s" % dt)
    tz = pytz.timezone(config['local_tz'])
    dt = tz.localize(dt)
    t = util.timestamp(dt)
    log.info("timestamp %s" % t)

    try:
        image = Image.open(path)
        width, height = image.size    
    except Exception as e:
        log.error(log.exc(e))
        width, height = None, None      

    coords = model.get_coords_by_time(t);
    feature = geojson.Feature(geometry=coords,properties={'utc_t': t, 'ContentType': "image", 'url': "/static/data/images/%s_%s.jpg" % (front,t), 'DateTime': dt.astimezone(pytz.timezone(config['local_tz'])).strftime("%Y-%m-%dT%H:%M:%S%z"), 'size': [width, height]})
    feature_id = model.insert_feature('image', t, geojson.dumps(feature))
    new_path = os.path.join(os.path.dirname(__file__), "static", "data", "images", "%s_%s.jpg" % (front,t))
    shutil.copy(path, new_path)
"""    