import json, math
from ingest import ingest_json_body
from housepy import config, log, strings, util

def parse(request):
    log.info("ambit_geo.parse")
    sample = ingest_json_body(request)
    if sample is None:
        return sample, "Could not parse"

    data = {}
    for key, value in sample.items():
        if key == "UTC":
            dt = util.parse_date(sample['UTC']) # these are marked UTC in the data
            t = util.timestamp(dt)
            data['t_utc'] = t
            continue
        if key == "Longitude":
            data['longitude'] =  math.degrees(float(sample['Longitude']))
            continue                       
        if key == "Latitude":
            data['latitude'] = math.degrees(float(sample['Latitude']))
            continue
        if key == "GPSAltitude":
            data['altitude'] = float(sample['GPSAltitude'])
            continue
        if type(value) != str:
            continue                            
        data[key] = strings.as_numeric(value) 

    return data