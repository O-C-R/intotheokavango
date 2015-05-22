import geojson, json, random, time, os, datetime
from ingest import ingest_data
from housepy import config, log, strings, util, net
from twython import Twython, TwythonError
from mongo import db

"""
    Grab tweets from main timeline and hashtagged tweets from associated accounts

"""


AUTH = config['twitter']['main']
ACCOUNTS = [list(item.keys())[0] for item in config['twitter']['accounts']]
MEMBERS = [list(item.values())[0] for item in config['twitter']['accounts']]
HASHTAG = config['twitter']['hashtag']


def parse(request):
    log.info("tweet.parse")
    log.error("nop")    # dont call via post
    return None


def main(): ## called via tweet_grabber.py

    twitter = Twython(AUTH['app_key'], AUTH['app_secret'], AUTH['oauth_token'], AUTH['oauth_token_secret'])
    twitter.verify_credentials() ## what does this do if it fails?
    
    for a, account in enumerate(ACCOUNTS):
        log.info("Checking %s..." % account)
        try: 
            timeline = twitter.get_user_timeline(screen_name=account)
        except TwythonError as e:
            log.error(log.exc(e))
            continue        
        log.info("--> %s has %s total tweets" % (account, len(timeline)))
        for t, tweet in enumerate(timeline):
            # log.debug(json.dumps(tweet, indent=4, default=lambda x: str(x)))
            log.info("Tweet %s:%s" % (a, t))
            text = tweet.get('text')
            if a == 0 or HASHTAG.lower() in text.lower():  # the first entry in the accounts is the official account -- all tweets are processed
                try:
                    data = {}
                    dt = datetime.datetime.strptime(tweet.get('created_at'), '%a %b %d %H:%M:%S +0000 %Y')
                    data['t_utc'] = util.timestamp(dt)
                    data['Member'] = MEMBERS[a]
                    data['Handle'] = account                    
                    data['Text'] = text
                    data['Retweet'] = text[:2] == "RT"
                    data['Url'] = "https://twitter.com/%s/status/%s" % (account, tweet.get('id'))
                    data['TweetID'] = tweet.get('id')
                    data['Images'] = []
                    dup = db.features.find_one({'properties.FeatureType': 'tweet', 'properties.TweetID': data['TweetID']})
                    if dup is not None:
                        log.info("--> skipping duplicate tweet")
                        continue
                    try:
                        for image in tweet['extended_entities']['media']:
                            if image['type'] != "photo":
                                continue
                            data['Images'].append({'Url': image['media_url']})
                            log.info("--> added image %s" % image['media_url'])
                    except KeyError as e:
                        pass
                    log.info("--> %s (RT: %s): %s" % (account, data['Retweet'], data['Text']))
                    success, value = ingest_data("tweet", data)
                    if not success:
                        log.error("--> failed: %s" % value)
                    else:
                        log.info("--> %s" % value)
                except Exception as e:
                    log.error(log.exc(e))
                    continue
            else:
                log.info("--> skipping unrelated tweet")
