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
    if 'utc_t' in data['properties']:
        data['properties']['t_utc'] = data['properties']['utc_t']
        del data['properties']['utc_t']
    if 't_utc' not in data['properties']:
        log.error("t_utc missing")
        return None
    data['properties']['expedition'] = "okavango_14"
    if 'ContentType' in data['properties']:
        del data['properties']['ContentType']

    """ hacks for correcting okavango_14 data go here """
    
    # Bird Name should be SpeciesName    
    for key, item in data['properties'].items():
        modkey = key.strip().lower().replace(' ', '')
        if modkey == "birdname":
            data['properties']['SpeciesName'] = item
            del data['properties'][key]

    # t_utc and DateTime dont match        
    t_utc = strings.as_numeric(data['properties']['t_utc'])
    t_utc -= 180000
    data['properties']['t_utc'] = t_utc    

    return data