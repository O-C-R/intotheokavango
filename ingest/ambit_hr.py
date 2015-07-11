import json, math
from ingest import ingest_json_body
from housepy import config, log, strings, util

def parse(request):
    log.info("ambit_hr.parse")
    data = ingest_json_body(request)
    if data is None:
        return data, "Could not parse"

    return data