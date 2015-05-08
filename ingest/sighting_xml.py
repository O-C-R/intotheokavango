import json, xmltodict, os, base64
from ingest import ingest_json_body, save_files, process_image, ingest_request
from housepy import config, log, util, strings

def parse(request):
    log.info("sighting.parse")

    paths = save_files(request)
    if not len(paths):
        return None

    # process the xml
    data = None
    for path in paths:
        if path[-3:] == "xml":
            try:
                with open(path) as f:
                    data = xmltodict.parse(f.read())
            except Exception as e:
                log.error(log.exc(e))
                return None
            break
    if data is None:
        return None        

    try:
        log.info("--> parsing XML")
        data = data['instance']
        feature = {'FeatureType': "sighting"}
        feature['Member'] = data['@dm:submitting_user'].split(' ')[0]
        data = data['inputs']
        dt = util.parse_date(data['Date___Time'])
        del data['Date___Time']
        feature['Latitude'] = data['Location'].split(',')[0].replace("lat=", '').strip()
        feature['Longitude'] = data['Location'].split(',')[1].replace("long=", '').strip()
        del data['Location']
        feature['t_utc'] = util.timestamp(dt)
        for key, value in data.items():
            if 'Image' in key:
                continue
            feature[key.replace('_', '')] = value
    except Exception as e:
        log.error(log.exc(e))
        return None

    log.debug(json.dumps(feature, indent=4))

    # Species_Name
    # Image_1
    # "Notes": "airport lounge.",
    #        "Location_Description": "swiss air airport lounge.",
    #        "Location_Sketch_Image":   

    log.info("Saving image file...")
    paths = []
    for key, value in data.items():
        if 'Image' not in key:
            continue
        try:
            path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", "%s_%s" % (util.timestamp(), "%s.jpg" % key)))
            with open(path, 'wb') as f:
                f.write(base64.b64decode(data[key]))
            log.info("--> saved %s" % path)
            paths.append(path)
        except Exception as e:
            log.error(log.exc(e))

    # process the image
    images = []
    for path in paths:
        image_data = process_image(path, feature['Member'] if 'Member' in feature else None, feature['t_utc'] if 't_utc' in feature else None)
        if image_data is None:
            continue
        # success, value = ingest_request("image", request)   # make a second request for the image featuretype
        # if not success:
        #     log.error(value)
        images.append(image_data)
    feature['Images'] = images


    return feature

