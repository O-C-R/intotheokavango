import json
from ingest import ingest_json
from housepy import config, log

def parse(request):
    log.info("feature.parse")
    # print(request.body)
    try:
        data = json.loads(str(request.body, encoding='utf-8'))
    except Exception as e:
        log.error(log.exc(e))
        return None
    return data
    
