import json, requests
from ingest import ingest_json_body, save_files, process_image, ingest_data
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
            log.info("Inserting image... %s" % path.split('/')[-1])
            image_data = process_image(path, data['Member'] if 'Member' in data else None, data['t_utc'] if 't_utc' in data else None)
            if image_data is None:
                log.info("--> no image data")
                continue            
            success, value = ingest_data("image", image_data.copy())   # make a second request for the image featuretype
            if not success:
                log.error(value)
            del image_data['Member']
            del image_data['t_utc']                
            images.append(image_data)
            log.info("--> image added")
    data['Images'] = images

    if 'SpeciesName' in data:
        data['Taxonomy'] = get_taxonomy(data['SpeciesName'])
    else:
        data['Taxonomy'] = None

    return data


def get_taxonomy(name):
    try:
        log.info("Getting taxonomy from GBIF...")
        response = requests.get("http://api.gbif.org/v1/species/search?q=" + name + "&rank=species")
        result = response.json()['results'][0]
        taxonomy = {strings.camelcase(key): value for (key, value) in result.items() if key in ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']}
    except Exception as e:
        log.error(log.exc(e))
        return None
    return taxonomy