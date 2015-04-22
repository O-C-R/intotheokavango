#!/usr/bin/env python3

import geojson, json, random, time, os, datetime
from twython import Twython, TwythonError
from housepy import config, log, util, process, net

AUTH = config['twitter']['main']
ACCOUNTS = config['twitter']['accounts']
HASHTAG = config['twitter']['hashtag']

def main():

    """Grab tweets from main timeline and associated accounts with tags"""

    twitter = Twython(AUTH['app_key'], AUTH['app_secret'], AUTH['oauth_token'], AUTH['oauth_token_secret'])
    twitter.verify_credentials() ## what does this do if it fails?
    
    for a, account in enumerate(ACCOUNTS):
        try: 
            timeline = twitter.get_user_timeline(screen_name=account)
        except TwythonError as e:
            log.error(log.exc(e))
        else:
            for tweet in timeline:
                if a == 0 or HASHTAG in tweet:  # the first entry in the accounts is the official account -- all tweets are processed
                    dt = datetime.datetime.strptime(tweet.get('created_at'), '%a %b %d %H:%M:%S +0000 %Y')
                    tweet['t_utc'] = util.timestamp(dt)
                    try:
                        url = "%s/ingest/tweet" % config['url']
                        log.info("Sending to %s..." % url)
                        response = net.read(url, str(json.dumps(tweet)).encode('utf-8'))
                        log.info("--> %s" % response)                                                        
                    except Exception as e:
                        log.error(log.exc(e))
                        continue


main()


