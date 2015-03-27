from ingest import ingest_json_file

def parse(request):
    log.info("sighting.parse")
    return ingest_json_file(request)

