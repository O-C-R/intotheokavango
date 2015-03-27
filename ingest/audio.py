from housep import log, util

def parse(request):
    log.info("audio.parse")
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
      log.info("ingest_audio %s" % path)

    file_name = path.split('/')[-1]
    file_name = file_name.split('.')[0]
    front = 'mp3'

    if ('_'  in file_name):
        front = file_name.split('_')[0]
        date_string = file_name.split('_')[1]
    else:
        date_string = file_name

    #dt = datetime.datetime.strptime(path.split('/')[-1], "audio %d%m%Y_%H%M.mp3")
    dt = datetime.datetime.strptime(date_string.split('_')[0], "%d%m%y%H%M%S")
    tz = pytz.timezone(config['local_tz'])
    dt = tz.localize(dt)
    t = util.timestamp(dt)    
    # if t <= t_protect:
    #     log.warning("Protected t, skipping...")
    #     return    

    """
    fixed_path = path #.replace(".mp3", ".amr")
    shutil.move(path, fixed_path)
    new_path = os.path.join(os.path.dirname(__file__), "static", "data", "audio", "%s-%s.wav" % (front, t))    

    log.debug("CONVERTING SOUND.")
    try:
        log.debug("--> converting [%s] to [%s]" % (fixed_path, new_path))
        log.debug("%s -y -i '%s' '%s'" % (config['ffmpeg'], os.path.abspath(fixed_path), os.path.abspath(new_path)))
        subprocess.check_call("%s -y -i '%s' '%s'" % (config['ffmpeg'], os.path.abspath(fixed_path), os.path.abspath(new_path)), shell=True)
    except Exception as e:
        log.debug("ERROR.")
        log.error(log.exc(e))
        return
    log.debug("DONE CONVERTING SOUND.")
    """

    new_path = os.path.join(os.path.dirname(__file__), "static", "data", "audio", "%s-%s.mp3" % (front, t))   
    shutil.move(path, new_path)

    coords = model.get_coords_by_time(t);
    feature = geojson.Feature(geometry=coords,properties={'utc_t': t, 'ContentType': "audio", 'url': "/static/data/audio/%s-%s.mp3" % (front, t), 'DateTime': dt.astimezone(pytz.timezone(config['local_tz'])).strftime("%Y-%m-%dT%H:%M:%S%z")})
    feature_id = model.insert_feature('audio', t, geojson.dumps(feature))

"""    