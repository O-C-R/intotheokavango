import json
from ingest import ingest_json_body
from housepy import config, log, strings, util

def parse(request):
    log.info("ambit.parse")
    sample = ingest_json_body(request)
    if sample is None:
        return sample
 
    data = {}
    for key, value in sample.items():
        if key == "UTC":
            dt = util.parse_date(value) # these are marked UTC in the data
            t = util.timestamp(dt)
            data['t_utc'] = t
            continue
        if type(value) != str:
            continue                                    
        data[key] = strings.as_numeric(value)

    return data
