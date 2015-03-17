from housepy import config
from pymongo import MongoClient

mongo = config['mongo']
client = MongoClient(mongo['host'], mongo['port'])
db = client[mongo['database']]


## should indexes be on single attribtutes?

db.features.create_index([("date", DESCENDING), ("author", ASCENDING)])