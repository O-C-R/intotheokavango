import geojson, json, random, time, os, datetime, feedparser
from ingest import ingest_data
from housepy import config, log, strings, util, net
from mongo import db

"""
    Grab Medium blog entries

"""


ACCOUNTS = [list(item.keys())[0] for item in config['twitter']['accounts']] # same handles
MEMBERS = [list(item.values())[0] for item in config['twitter']['accounts']]


def parse(request):
    log.info("blog.parse")
    log.error("nop")    # dont call via post
    return None


def main(): ## called via tweet_grabber.py

    for a, account in enumerate(ACCOUNTS):
        log.info("Checking %s..." % account)
        try: 
            feed = "https://medium.com/feed/@%s" % account
            data = feedparser.parse(feed)['entries']
        except Exception as e:
            log.error(log.exc(e))
            continue    
        for entry in data:
            try:
                entry = {strings.camelcase(key): value for (key, value) in entry.items() if key in ['title', 'link', 'summary', 'published']}
                entry['Member'] = MEMBERS[a]
                entry['t_utc'] = util.timestamp(util.parse_date(entry['Published']))
                if entry['t_utc'] < util.timestamp(util.parse_date(str(config['start_date'][config['expedition']]))):
                    log.info("--> skipping too early blog post")
                    continue
                del entry['Published']
                entry['Url'] = entry['Link']
                del entry['Link']                
                entry['Summary'] = strings.strip_html(entry['Summary']).replace("Continue reading on Medium \u00bb", "")
                entry['FeatureType'] = "blog"
                dup = db.features.find_one({'properties.FeatureType': 'blog', 'properties.Url': entry['Url']})
                if dup is not None:
                    log.info("--> skipping duplicate blog post")
                    continue
                log.info("--> %s" % entry)
                success, value = ingest_data("tweet", entry)
                if not success:
                    log.error("--> failed: %s" % value)
                else:
                    log.info("--> %s" % value)
            except Exception as e:
                log.error(log.exc(e))
                continue