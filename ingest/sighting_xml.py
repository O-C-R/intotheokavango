import json, xmltodict, os, base64
from ingest import ingest_json_body, save_files, process_image, ingest_data, ingest_plain_body
from housepy import config, log, util, strings
from ingest.sighting import get_taxonomy

def parse(request):
    log.info("sighting_xml.parse")

    try:
        content = ingest_plain_body(request)
        data = xmltodict.parse(content)
    except Exception as e:
        log.error(log.exc(e))
        return None, "Parsing error"

    try:
        log.info("--> parsing XML")
        data = data['instance']
        feature = {'FeatureType': "sighting", 'Delivery': "devicemagic"}
        log.debug(json.dumps(data, indent=4, default=lambda x: str(x)))
        # feature['Member'] = data['@dm:submitting_user'].split(' ')[0] # let TeamMember override this

        dt = util.parse_date(data['@writeTime'])
        data = data['inputs']

        for alias in ['Date___Time_Question', 'Date___Time']:
            if alias in data:
                dt = util.parse_date(data[alias])            
                del data[alias]
        feature['t_utc'] = util.timestamp(dt)

        for alias in ['Current_Location', 'LocationQuestion', 'Location_Question', 'GPSLocation']:
            if alias in data:
                data['Location'] = data[alias]
                del data[alias]
        if 'Location' in data:
            try:
                feature['Latitude'] = data['Location'].split(',')[0].replace("lat=", '').strip()
                feature['Longitude'] = data['Location'].split(',')[1].replace("long=", '').strip()
                feature['Altitude'] = data['Location'].split(',')[2].replace("alt=", '').strip()
                del data['Location']
            except Exception as e:
                log.error(log.exc(e))

        for key, value in data.items():
            if 'Image' in key:
                continue
            feature[key.replace('_', '')] = value

        # purge blanks
        feature = {key: value for (key, value) in feature.items() if type(value) != str or len(value.strip())}

        # get SpeciesName
        for alias in ['Species', 'Species_Name', 'Animal', 'SpeciesNameOther', 'Dominant_species', 'Dominant_Species']:
            alias = alias.replace('_', '')
            if alias in feature and len(feature[alias].strip()):
                feature['SpeciesName'] = strings.titlecase(feature[alias].replace('_', ' ').strip())
                if alias != 'SpeciesName':
                    del feature[alias]        
        if 'SpeciesName' not in feature:
            log.error("Missing SpeciesName")
            return None, "Missing SpeciesName"

        if 'Count' not in feature and 'count' not in feature:
            feature['Count'] = 1
        log.debug(json.dumps(feature, indent=4))        

    except Exception as e:
        log.error(log.exc(e))
        return None, "Unexpected fields"

    feature['Taxonomy'] = get_taxonomy(feature['SpeciesName']) 

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
        log.info("Inserting image... %s" % path.split('/')[-1])
        image_data = process_image(path, feature['Member'] if 'Member' in feature else None, feature['t_utc'] if 't_utc' in feature else None)
        if image_data is None:
            log.info("--> no image data")
            continue
        success, value = ingest_data("image", image_data.copy())   # make a second request for the image featuretype        
        if not success:
            log.error(value)
        if 'Member' in image_data:
            del image_data['Member']            
        images.append(image_data)
        log.info("--> image added")
    feature['Images'] = images

    # use image data to assign a timestamp to the sighting
    if 'getImageTimestamp' in feature and feature['getImageTimestamp'] == True and len(feature['Images']) and 't_utc' in feature['Images'][0]:
        feature['t_utc'] = feature['Images'][0]['t_utc']
        log.info("--> replaced sighting t_utc with image data")
    if 'getImageTimestamp' in feature:
        del feature['getImageTimestamp']

    return feature

