from housepy import config, log
from ingest import ingest_json_body

def parse(request):
    log.info("twilio.parse")
    return ingest_json_body(request)
