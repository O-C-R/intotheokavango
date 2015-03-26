#!/usr/bin/env python3

import sqlite3, json, time, sys, os, geojson, datetime, pytz, ingest
from housepy import config, log, util, net

def db_call(f):
    def wrapper(*args):
        try:
            connection = sqlite3.connect(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "okavango", "data.db")))
        except sqlite3.OperationalError:
            connection = sqlite3.connect(os.path.abspath(os.path.join(os.path.dirname(__file__), "data.db")))
        connection.row_factory = sqlite3.Row
        db = connection.cursor()
        results = f(db, *args)
        connection.commit()
        connection.close()
        return results
    return wrapper

@db_call
def fetch_features(db, kinds, start_t, stop_t, skip=1):
    kindq = []
    for kind in kinds:
        kindq.append(" OR kind='%s'" % kind)
    query = "SELECT rowid, data FROM features WHERE rowid %% ? = 0 AND (1=0%s) AND t>=? AND t<? ORDER BY t" % ''.join(kindq)
    log.debug(query)
    db.execute(query, (skip, start_t, stop_t))
    features = []
    # this is slow
    for row in db.fetchall():
        feature = geojson.loads(row['data'])
        feature.id = row['rowid'] 
        features.append(feature)
    return features

# ambit, ambit_geo, audio, beacon, ethnographic, hydrosensor, image, sighting, tweet
if len(sys.argv) > 1:
    feature_type = sys.argv[1]
else:
    print("[FeatureType]")
    exit()
try:
    dt = datetime.datetime.now(pytz.timezone(config['local_tz'])).strftime("%Y-%m-%d")
    dt = util.parse_date(dt, tz=config['local_tz'])
    days = 365
except Exception as e:
    log.error("Bad parameters: %s" % log.exc(e))
    exit()
t = util.timestamp(dt)        
features = fetch_features((feature_type,), t - (days * (24 * 60 * 60)), t, 1)

log.info("num_features %s" % len(features))
for data in features:#[-200:]:
    data['properties']['FeatureType'] = feature_type
    data_str = json.dumps(data, indent=4)
    data_bytes = data_str.encode('utf-8')
    log.info(data_str)
    try:
        response = net.read("http://localhost:7777/ingest/migration", data_bytes)
    except Exception as e:
        log.error(e)
    else:
        log.info(response)