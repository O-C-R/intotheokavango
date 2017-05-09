import json, xmltodict, os, base64
from collections import OrderedDict
from ingest import ingest_json_body, save_files, process_image, ingest_data, ingest_plain_body
from housepy import config, log, util, strings
from ingest.sighting import get_taxonomy

def parse(request):
    log.info("hydrology.parse")

    try:
        content = ingest_plain_body(request)
        data = xmltodict.parse(content)
    except Exception as e:
        log.error(log.exc(e))
        return None, "Parsing error"

    try:
        log.info("--> parsing XML")
        data = data['instance']

        feature = {'FeatureType': "hydrology", 'Delivery': "devicemagic"}
        feature.update(data['inputs'])
        for key, value in feature.items():
            if type(value) == OrderedDict:
                for k, v, in value.items():
                    value[k] = strings.as_numeric(v)
        feature['Member'] = data['@dm:submitting_user'].split(' ')[0]
        dt = util.parse_date(data['@writeTime'])
        feature['t_utc'] = util.timestamp(dt)
        log.debug(json.dumps(data, indent=4, default=lambda x: str(x)))

    except Exception as e:
        log.error(log.exc(e))
        return None, "Unexpected fields"

    return feature
