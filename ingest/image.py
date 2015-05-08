import json
from ingest import ingest_json_body, save_files, process_image
from housepy import config, log, util, strings

"""Expecting JSON or form metadata with Member and a timestamp in the local timezone"""

def parse(request):
    log.info("image.parse")

    paths = save_files(request) ## ends up being redundant if called through sighting
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

    # fix things
    if 'TeamMember' in data:
        data['Member'] = data['TeamMember']
        del data['TeamMember']                

    # adjust for sightings data making an extra feature (filter the fields we don't want)
    if 'FeatureType' in data and data['FeatureType'] == "sighting" or 'Bird Name' in data:
        data = {key: value for (key, value) in data.items() if key in ['Member', 'Expedition', 'Latitude', 'Longitude', 'Altitude', 'ResourceURL']}
        data['FeatureType'] = "image"

    # process the image
    for path in paths:
        if path[-4:] != "json":
            image_data = process_image(path, data['Member'] if 'Member' in data else None, data['t_utc'] if 't_utc' in data else None)
            data.update(image_data)
            break

    return data

