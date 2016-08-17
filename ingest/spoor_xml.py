import json, xmltodict, os, base64
from ingest import ingest_json_body, save_files, process_image, ingest_data, ingest_plain_body
from housepy import config, log, util, strings
from ingest.sighting import get_taxonomy

def parse(request):
    log.info("spool.parse")

    try:
        content = ingest_plain_body(request)
        data = xmltodict.parse(content)
    except Exception as e:
        log.error(log.exc(e))
        return None, "Parsing error"

    try:
        log.info("--> parsing XML")
        data = data['instance']
        feature = {'FeatureType': "sighting"}
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

    except Exception as e:
        log.error(log.exc(e))
        return None, "Unexpected fields"

    return feature

