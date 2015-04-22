import json, shutil, uuid, os
from housepy import log, util, config
from PIL import ExifTags, Image
from ingest import save_file, ingest_json_body, ingest_form_vars

"""Expecting JSON or form metadata with Member, Tags, and a timestamp in the local timezone"""

def parse(request):
    log.info("image.parse")
    path = save_file(request) 
    if path is None:
        return None

    # try to get EXIF data
    try:    
        image = Image.open(path)  
        width, height = image.size      
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
    data['Width'] = width
    data['Height'] = height

    log.debug(data)

    return data
