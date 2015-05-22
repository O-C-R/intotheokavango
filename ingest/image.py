import json
from ingest import ingest_json_body, save_files, process_image, ingest_data
from housepy import config, log, util, strings
from housepy.server import Application
from bson.objectid import ObjectId

"""Expecting JSON or form metadata with Member and a timestamp in the local timezone"""

def parse(request):
    log.info("image.parse")

    paths = save_files(request) ## ends up being redundant if called through sighting
    if not len(paths):
        return None, "No files"

    # process the json
    data = None
    for path in paths:
        if path[-4:] == "json":
            try:
                with open(path) as f:
                    data = json.loads(f.read())
            except Exception as e:
                log.error(log.exc(e))
                return None, "Could not parse"
            break
    if data is None:
        return None, "Missing data"

    # fix things
    if 'TeamMember' in data:
        data['Member'] = data['TeamMember']
        del data['TeamMember']   
    if 'SightingID' in data and not len(data['SightingID'].strip()):
        data['SightingID'] = None
    if 'Notes' in data and not len(data['Notes'].strip()):
        data['Notes'] = None

    # process the image -- add the same metadata for each one, and update with the image's data
    images = []
    for path in paths:        
        if path[-4:] != "json":
            image_data = process_image(path, data['Member'] if 'Member' in data else None, data['t_utc'] if 't_utc' in data else None)
            current_data = data.copy()
            current_data.update(image_data)
            success, value = ingest_data("image", current_data)
            if not success:
                return None, value
            ## note that this might still end up ingesting prior images

            if 'Member' in image_data:
                del image_data['Member']
            images.append(image_data)

    if 'SightingID' in data and data['SightingID'] is not None:
        log.info("Linking to sighting %s..." % data['SightingID'])
        db = Application.instance.db            
        try:
            feature = db.features.find_one({'_id': ObjectId(data['SightingID'])})
            if feature is None:
                log.warning("--> sighting with id %s not found..." % data['SightingID'])
                ## no feedback given here
            else:
                current_images = feature['properties']['Images']
                log.debug("current_images %s" % current_images)
                images += current_images
                log.debug("images %s" % images)
                result = db.features.update({'_id': ObjectId(data['SightingID'])}, {'$set': {'properties.Images': images}})
                log.debug(result)
                log.info("--> success")
        except Exception as e:
            log.error(e)

    # stop executing, but still return success
    return True     

