from housepy import config, log, strings
from ingest import ingest_plain_body

def parse(request):
    log.info("sensor.parse")
    content = ingest_plain_body(request)
    content = strings.singlespace(content)
    tokens = content.split(" ")
    log.debug(tokens)
    try:
        data = {'t_utc': tokens[0], 'SensorName': tokens[1], strings.camelcase(tokens[2]): tokens[3]}
    except Exception as e:
        log.error("Twilio post is malformed: %s" % log.exc(e))
        return None
    return data

"""
will we have location in this?
if not, we'll want to prevent it from being estimated, right?

"""