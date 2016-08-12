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

    try:

        log.debug(data)
        feature = {}

    except Exception as e:
        log.error(log.exc(e))
        return None, "Unexpected fields"


    return feature

