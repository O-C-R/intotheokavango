from ingest import ingest_json_body
from housepy import config, log, strings, util, net

"""Receives from tweet_grabber"""

def parse(request):
    log.info("tweet.parse")
    return ingest_json_body(request)
