from ingest import ingest_json_body
from housepy import config, log, util, strings

def parse(request):
    log.info("sighting.parse")

    data = ingest_json_body(request)
    if data is None:
        return data

    # Bird Name should be SpeciesName    
    for key, item in data.items():
        modkey = key.strip().lower().replace(' ', '')
        if modkey == "birdname":
            data['SpeciesName'] = item
            del data[key]                

    return data

