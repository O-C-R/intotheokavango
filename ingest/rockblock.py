import json, codecs, os
from ingest import ingest_form_vars
from housepy import config, log, util, strings

def parse(request):
    log.info("rockblock.parse")

    try:
        data = ingest_form_vars(request)
        data = codecs.decode(data['data'], "hex").decode('utf-8')
    except Exception as e:
        log.error(log.exc(e))
        return None, "Parsing error"

    labels = ['t_utc', 'v1', 'v2', 'v3']
    values = data.split(",")
    feature = {'FeatureType': "sensor", 'Delivery': "rockblock"}
    for l, label in enumerate(labels):
        try:
            feature[label] = strings.as_numeric(values[l])
        except IndexError:
            log.error("Missing value for %s" % label)
    log.debug(feature)


    return True

