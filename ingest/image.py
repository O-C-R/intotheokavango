from housep import log, util

def parse(request):
    log.info("image.parse")
    # date_string = path.split('/')[-1] 
    # dt = datetime.datetime.strptime(date_string.split('_')[0], "%d%m%Y%H%M")
    # tz = pytz.timezone(config['local_tz'])
    # dt = tz.localize(dt)
    # t = util.timestamp(dt)
    # # if t <= t_protect:
    # #     log.warning("Protected t, skipping...")
    # #     return                    
    # try:
    #     image = Image.open(path)
    #     width, height = image.size    
    # except Exception as e:
    #     log.error(log.exc(e))
    #     width, height = None, None        
    # # feature = geojson.Feature(properties={'utc_t': t, 'ContentType': "image", 'url': "/static/data/images/%s-%s.jpg" % (t, i), 'DateTime': dt.astimezone(pytz.timezone(config['local_tz'])).strftime("%Y-%m-%dT%H:%M:%S%z"), 'size': [width, height]})
    # feature_id = model.insert_feature('image', t, geojson.dumps(feature))
    # new_path = os.path.join(os.path.dirname(__file__), "static", "data", "images", "%s-%s.jpg" % (t, i))
    # shutil.copy(path, new_path)

    return feature


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