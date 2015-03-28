from ingest import ingest_json_body
from housepy import config, log, strings, util, net

def parse(request):
    log.info("tweet.parse")
    return ingest_json_body(request)
