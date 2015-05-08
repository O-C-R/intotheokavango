import json
from ingest import ingest_json_body, save_files, process_image, ingest_request
from housepy import config, log, util, strings

def parse(request):
    log.info("sighting.parse")

    paths = save_files(request)
    if not len(paths):
        return None

    # process the json
    data = None
    for path in paths:
        if path[-4:] == "json":
            try:
                with open(path) as f:
                    data = json.loads(f.read())
            except Exception as e:
                log.error(log.exc(e))
                return None
            break
    if data is None:
        return None
        
    # make corrections
    # Bird Name should be SpeciesName    
    for key, item in data.items():
        modkey = key.strip().lower().replace(' ', '')
        if modkey == "birdname":
            data['SpeciesName'] = item
            del data[key] 
    if 'TeamMember' in data:
        data['Member'] = data['TeamMember']
        del data['TeamMember']          

    # process the image
    images = []
    for path in paths:
        if path[-4:] != "json":
            image_data = process_image(path, data['Member'] if 'Member' in data else None)
            if image_data is None:
                continue            
            # success, value = ingest_request("image", request)   # make a second request for the image featuretype
            # if not success:
            #     log.error(value)
            images.append(image_data)
    data['Images'] = images

    return data

