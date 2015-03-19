#!/usr/bin/env python3

import sqlite3, json, time, sys, os, geojson, datetime, pytz, ingest
from housepy import config, log, util, net

def db_call(f):
    def wrapper(*args):
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



kind = "sighting"
try:
    dt = datetime.datetime.now(pytz.timezone(config['local_tz'])).strftime("%Y-%m-%d")
    dt = util.parse_date(dt, tz=config['local_tz'])
    days = 365
except Exception as e:
    log.error("Bad parameters: %s" % log.exc(e))
    exit()
t = util.timestamp(dt)        
features = fetch_features((kind,), t - (days * (24 * 60 * 60)), t, 1)

print("num_features", len(features))
for data in features[-200:]:
    data['properties']['kind'] = kind
    data_str = json.dumps(data, indent=4)
    data_bytes = data_str.encode('utf-8')
    print(data_str)

    response = net.read("http://localhost:9999/ingest/migration", data_bytes)
    print(response)