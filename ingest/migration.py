import json
from ingest import ingest_json_body
from housepy import config, log, strings, util

def parse(request):
    """Migrate okavango_14 data and fix tz issue with t_utcs"""
    log.info("migration.parse")
    data = ingest_json_body(request)
    if 'properties' not in data:
        log.error("properties missing")
        return None
    if 't_utc' not in data['properties']:
        log.error("t_utc missing")
        return None
    t_utc = strings.as_numeric(data['properties']['t_utc'])
    t_utc -= 180000
    data['properties']['t_utc'] = t_utc
    data['properties']['DateTime'] = util.datestring(t_utc, tz=config['local_tz'])
    data['expedition'] = "okavango_14"
    return data