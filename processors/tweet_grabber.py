# Into the Okavango Twitter Scraper
# Gets feeds from @okavangodata and pipes into server

import geojson, json, random, time, os

from twython import Twython
from twython import TwythonError
from datetime import datetime
from time import mktime
from housepy import config, log, util, process, net

APP_KEY = config['twitter']['main']['app_key']
APP_SECRET = config['twitter']['main']['app_secret']
OAUTH_TOKEN = config['twitter']['main']['oauth_token']
OAUTH_TOKEN_SECRET = config['twitter']['main']['oauth_token_secret']

APP_KEY_DATA = config['twitter']['data']['app_key']
APP_SECRET_DATA = config['twitter']['data']['app_secret']
OAUTH_TOKEN_DATA = config['twitter']['data']['oauth_token']
OAUTH_TOKEN_SECRET_DATA = config['twitter']['data']['oauth_token_secret']

def main():

    twitter = Twython(APP_KEY, APP_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
    twitter.verify_credentials();

    twitter_data = Twython(APP_KEY_DATA, APP_SECRET_DATA, OAUTH_TOKEN_DATA, OAUTH_TOKEN_SECRET_DATA)
    twitter_data.verify_credentials();

    # 1.  Get timeline for @okavangodata feed
    try: 
        data_timeline = twitter.get_user_timeline(screen_name='okavangodata')
    except TwythonError as e:
        log.error(log.exc(e))

    # Look for tweets that are location reports.
    # ie: I am here Lat+40.704750 Lon-73.988217  Alt+139ft GPS Sats seen: 05 http://map.iridium.com/m?lat=40.704750&lon=-73.988217  Sent via Iridiu 
    for tweet in data_timeline:
        #Does it contain Lat Lon and Alt?
        txt = tweet.get('text')

        if 'dropped!' in txt:

            ## bh: for hyrdodrops, replaced by twilio? skipping for now

            pass
        #     data = {}
        #     tokens = txt.split(' ')
        #     for token in tokens:
        #         if ':' in token:
        #             key, value = token.split(':')
        #             data[key] = value
        #     if 'lat' in data and 'lon' in data and 'id' in data:
        #         model.insert_hydrodrop(util.timestamp(), data['id'], data['lat'], data['lon'])

        elif ('Lat' in txt and 'Lon' in txt and 'Alt' in txt):

            ## bh: why are beacons being logged via twitter? skipping for now

            pass

            lat = 0
            lon = 0
            #Get Lat
            p = txt.index('Lat')
            # is it in degree notation?
            if ('deg' in txt):
                #print txt[p + 3:p + 13]
                # print('degrees')
                pass
            else:
                lat = float(txt[p + 3:p + 13])

            #print(txt);

            #Get Lon
            p = txt.index('Lon')
            # is it in degree notation?
            if ('deg' in txt):
                #print txt[p + 3:p + 13]
                # print('degrees')
                pass
            else:
                lon = float(txt[p + 3:p + 13])

            #Get Alt
            p = txt.index('Alt')
            # is it in degree notation?
            alt = float(txt[p + 3:p + 7])

            #Get Time
            #Mon Aug 04 15:21:31 +0000 2014
            dt = tweet.get('created_at')
            date_object = datetime.strptime(dt, '%a %b %d %H:%M:%S +0000 %Y')

            #Make JSON
            # if (lat != 0):
            #     t = (date_object - datetime(1970,1,1)).total_seconds();
            #     coordinates = (lon,lat,alt);
            #     properties = {'DateTime': date_object.strftime("%Y-%m-%dT%H:%M:%S%z"), 't_utc': t, 'ContentType': 'beacon'}
            #     feature = geojson.Feature(geometry={'type': "Point", 'coordinates': coordinates}, properties=properties)

            #     #check protect
            #     t_protect = model.get_protect('beacon')
            #     if (t > t_protect):    
            #         model.insert_feature('beacon', t, geojson.dumps(feature))
            #     #print(feature);

        elif '!!' in txt:

            ## bh: what does this do?
            pass

            atwt = txt.split('!!')[1];
            #twitter.update_status(status=atwt);

            #Get Time
            #Mon Aug 04 15:21:31 +0000 2014
            dt = tweet.get('created_at')
            date_object = datetime.strptime(dt, '%a %b %d %H:%M:%S +0000 %Y')

            t = int((date_object - datetime(1970,1,1)).total_seconds());

            t2 = int(time.time());

            # print(t);
            # print(t2);

            if (t2 - t < 10 * 60):
                twitter.update_status(status=atwt);




            #print("AUTO TWEET:" + atwt)

    # 2.  Get timeline for all associated feeds

    ## a. intotheokavango - all tweets
    try: 
        main_timeline = twitter.get_user_timeline(screen_name='intotheokavango')
    except TwythonError as e:
        log.error(log.exc(e))

    # File these tweets into the DB
    for tweet in main_timeline:
        #Get Time
        #Mon Aug 04 15:21:31 +0000 2014
        dt = datetime.strptime(tweet.get('created_at'), '%a %b %d %H:%M:%S +0000 %Y')
        tweet['t_utc'] = util.timestamp(dt)

        try:
            url = "%s/ingest/tweet" % config['url']
            log.info("Sending to %s..." % url)
            response = net.read(url, str(json.dumps(tweet)).encode('utf-8'))
            log.info("--> %s" % response)                                                        
        except Exception as e:
            log.error(log.exc(e))
            continue

        #else:
            #print("TWEET NOT NEWEST. NEWEST IS:" + str(t_protect) + " THIS ONE IS:" + str(t))

    ## b. others - #okavango14 tagged 
    accts = ('blprnt','shahselbe','rustictoad','AdventurScience','rangerdiaries','jameskydd','okavangowild','drsteveboyes')
    for ac in accts:

        try: 
            main_timeline = twitter.get_user_timeline(screen_name=ac)
        except TwythonError as e:
            log.error(log.exc(e))

        # File these tweets into the DB
        for tweet in main_timeline:
            #Get Time
            #Mon Aug 04 15:21:31 +0000 2014
            if ('#okavango15' in tweet['text']):
                dt = datetime.strptime(tweet.get('created_at'), '%a %b %d %H:%M:%S +0000 %Y')
                tweet['t_utc'] = util.timestamp(dt)

                try:
                    url = "%s/ingest/tweet" % config['url']
                    log.info("Sending to %s..." % url)
                    response = net.read(url, str(json.dumps(tweet)).encode('utf-8'))
                    log.info("--> %s" % response)                                                        
                except Exception as e:
                    log.error(log.exc(e))
                    continue

    ## bh: how should this work?

    # #4. -  Tweet sightings to okavangodata
    # log.info("Looking for untweeted sightings...")

    # query = "SELECT * FROM features WHERE kind = 'sighting' AND tweeted = 0 AND t > 1407890717"
    # results = model.db_query(query)
    # for row in results:
    #     j = json.loads(row['data'])
    #     props = j['properties']
    #     tweet = str(props['TeamMember']) + ' just spotted: ' + str(props['Count']) + ' ' + str(props['Bird Name']) + ' Lat:' + str(props['Latitude']) + ' Lon:' + str(props['Longitude']) + ' Activity:' + str(props['Activity'])
        
    #     try:
    #         twitter_data.update_status(status=tweet);
    #     except TwythonError as e:
    #         log.error(log.exc(e))

    #     #10% of the time, tweet it to the main account.
    #     if (random.randint(0,100) < 10):
    #         try:
    #             # disabling this for now
    #             #twitter_data.update_status(status=tweet);
    #             pass
    #         except TwythonError as e:
    #             log.error(log.exc(e)(

    #         log.info("---- TWEET" + tweet)

    # print("UPDATING TABLE")
    # query2 = "UPDATE features SET tweeted = 1 WHERE kind = 'sighting' AND tweeted = 0 AND t > 1407890717"
    # model.db_query(query)
    # print("TABLE UPDATED.")



main()

