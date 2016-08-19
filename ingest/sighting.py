import json, requests
from ingest import ingest_json_body, save_files, process_image, ingest_data
from housepy import config, log, util, strings

def parse(request):
    log.info("sighting.parse")

    paths = save_files(request)
    if not len(paths):
        return None, "No files"

    # process the json
    data = None
    for path in paths:
        if path[-4:] == "json":
            try:
                with open(path) as f:
                    content = f.read()
                    log.debug("--> loaded file")
                    datas = json.loads(content)
                    log.debug("--> decoded json")
            except Exception as e:
                log.error(log.exc(e))
                return None, "Could not parse JSON"
            break
    if datas is None:
        return None, "No data"
        
    if type(datas) == dict:
        datas = [datas]

    for data in datas:

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

        # purge blanks
        data = {key: value for (key, value) in data.items() if type(value) != str or len(value.strip())}
        if 'SpeciesName' not in data:
            log.error("Missing SpeciesName")
            return None, "Missing SpeciesName"
        data['SpeciesName'] = strings.titlecase(data['SpeciesName'])       

        if 'Count' not in data and 'count' not in data:
            data['Count'] = 1
        log.debug(json.dumps(data, indent=4))
        data['Taxonomy'] = get_taxonomy(data['SpeciesName'])


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
                if 'Member' in image_data:
                    del image_data['Member']
                images.append(image_data)
                log.info("--> image added")
        data['Images'] = images

        # use image data to assign a timestamp to the sighting
        if 'getImageTimestamp' in data and data['getImageTimestamp'] == True and len(data['Images']) and 't_utc' in data['Images'][0]:
            data['t_utc'] = data['Images'][0]['t_utc']
            log.info("--> replaced sighting t_utc with image data")
        if 'getImageTimestamp' in data:
            del data['getImageTimestamp']

        if 'ResourceURLs' in data:
            del data['ResourceURLs']

        success, value = ingest_data("sighting", data)
        if not success:
            return None, value


    return True


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