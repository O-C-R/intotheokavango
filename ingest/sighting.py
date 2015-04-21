from ingest import ingest_json_file
from housepy import config, log

def parse(request):
    log.info("sighting.parse")
    return ingest_json_file(request)

