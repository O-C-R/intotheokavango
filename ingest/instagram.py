import geojson, json, random, time, os, datetime, requests
from ingest import ingest_data
from housepy import config, log, strings, util, net
from mongo import db

"""
    Grab instagrams from main timeline and hashtagged tweets from associated accounts

"""

settings = config['instagram']

def parse(request):
    log.info("instagram.parse")
    log.error("nop")    # dont call via post
    return None


def main(): ## called via instagram_grabber.py
    try:
        response = requests.get("https://api.instagram.com/v1/tags/%s/media/recent?client_id=%s" % (settings['hashtag'], settings['client_id']))
        photos = response.json()['data']
        for photo in photos:
            username = photo['user']['username']
            if username not in settings['accounts']:
                log.info("Skipping photo by %s" % username)
                continue
            data = {'Member': settings['accounts'][username]}
            data['caption'] = photo['caption']['text']               
            data['instagram_id'] = photo['id']  
            data['tags'] = photo['tags']
            data['filter'] = photo['filter']
            data['Url'] = photo['link']
            data['t_utc'] = int(photo['created_time'])
            photo_url = photo['images']['standard_resolution']['url']
            print(json.dumps(data, indent=4))            
            print("")
    except Exception as e:
        log.error(log.exc(e))