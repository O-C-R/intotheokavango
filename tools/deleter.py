#!/usr/bin/env python3

import sys, requests, json
from housepy import strings, util, log
from mongo import db, ObjectId


feature_id = input("Find ID: ")
feature_id = ObjectId(feature_id)
result = list(db.features.find({'_id': feature_id}))

if not len(result):
    print("Not found")
    exit()

print(json.dumps(result, indent=4, default=lambda x: str(x)))

try:
    input("Press return to really delete")
except KeyboardInterrupt:
    print("Nothing deleted")
    print("\nBye!")
    exit()


result = db.features.remove({'_id': feature_id})
print(result)

