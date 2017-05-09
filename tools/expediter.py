#!/usr/bin/env python3

import sys, requests, json
from housepy import strings, util, log, config
from mongo import db, ObjectId

start_date = util.parse_date(str(config['start_date']["cuando_16"]), tz=config['local_tz'])
start_date_t = util.timestamp(start_date)

results = db.features.find()

db.features.remove({'properties.Expedition': "cuando_16", 'properties.EstimatedGeometry': {'$ne': None, '$exists': True}}, multi=True)

