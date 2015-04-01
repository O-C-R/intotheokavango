from housepy import config, log
from ingest import ingest_json_file

def parse(request):
    log.info("hydro.parse")
    return ingest_json_file(request)

