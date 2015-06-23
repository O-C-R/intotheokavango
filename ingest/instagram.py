import geojson, json, random, time, os, datetime, requests
from ingest import ingest_data, process_image
from housepy import config, log, strings, util, net
from mongo import db

"""
    Grab instagrams from main timeline and hashtagged tweets from associated accounts

"""

settings = config['instagram']
ACCOUNTS = [list(item.keys())[0] for item in config['instagram']['accounts']]
MEMBERS = [list(item.values())[0] for item in config['instagram']['accounts']]

def parse(request):
    log.info("instagram.parse")
    log.error("nop")    # dont call via post
    return None


def main(): ## called via instagram_grabber.py
    try:
        response = requests.get("https://api.instagram.com/v1/tags/%s/media/recent?client_id=%s" % (settings['hashtag'], settings['client_id']))
        photos = response.json()['data']
    except Exception as e:
        log.error(log.exc(e))
    for photo in photos:
        image_id = None
        try:
            username = photo['user']['username']
            if username not in ACCOUNTS:
                log.info("Skipping photo by %s" % username)
                continue
            data = {}
            data['Url'] = photo['link']
            dup = db.features.find_one({'properties.FeatureType': 'instagram', 'properties.Url': data['Url']})
            if dup is not None:
                log.info("--> skipping duplicate")
                continue
            data['Member'] = MEMBERS[ACCOUNTS.index(username)]
            data['Caption'] = photo['caption']['text']               
            data['Tags'] = photo['tags']
            data['Filter'] = photo['filter']
            data['t_utc'] = int(photo['created_time'])
            data['InstagramPhotoURL'] = photo['images']['standard_resolution']['url']
            try:
                path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", "%s_%s.jpg" % (util.timestamp(), data['Url'].split("/")[-2])))
                net.grab(data['InstagramPhotoURL'], path)
                image_data = process_image(path, data['Member'], data['t_utc'])
                if image_data is None:
                    log.info("--> no image data")
                else:
                    success, image_id = ingest_data("image", image_data.copy())   # make a second request for the image featuretype
                    if not success:
                        log.error(image_id)
                    image_data['ImageUrl'] = image_data['Url']
                    del image_data['Url']
                    data.update(image_data)
            except Exception as e:
                log.error(log.exc(e))
        except Exception as e:
            log.error(log.exc(e))
            return
        success, post_id = ingest_data("instagram", data)
        if not success:
            log.error("--> failed: %s" % post_id)
        else:
            log.info("--> %s" % post_id)
        try:
            db.features.update({'_id': image_id}, {'$set': {'properties.InstagramID': post_id}})
        except Exception as e:
            log.error(log.exc(e))


    # try:
    #     for a, account in enumerate(ACCOUNTS):
    #         account = "h0use"
    #         log.info("Checking %s..." % account)
    #         try:
    #             url = "https://api.instagram.com/v1/users/%s/feed?access_token=%s" % (account, settings['access_token'])
    #             print(url)
    #             response = requests.get(url)
    #             print(response)
    #             photos = response.json()['data']
    #             break
    #         except Exception as e:
    #             log.error(log.exc(e))
    #             break
    #         log.info("--> %s has %s total photos" % (account, len(photos)))
    #         for p, photo in enumerate(photos):
    #             log.debug(json.dumps(photo, indent=4, default=lambda x: str(x)))
    #             # log.info("Tweet %s:%s" % (a, t))
    #             # text = tweet.get('text')
    #             # if a == 0 or HASHTAG.lower() in text.lower():  # the first entry in the accounts is the official account -- all tweets are processed
