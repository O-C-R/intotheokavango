import json
from housepy import util, log, config, strings
from ingest import ingest_json_body, ingest_data

def parse(request):
    log.info("databoat.parse")
    data = ingest_json_body(request)
    try:
        for reading in data:
            log.debug(json.dumps(reading, indent=4, default=lambda x: str(x)))
            if 'gps_long' in reading and 'gps_lat' in reading:
                reading['Longitude'] = reading['gps_long']
                del reading['gps_long']
                reading['Latitude'] = reading['gps_lat']
                del reading['gps_lat']
            reading['FeatureType'] = "sensor"
            reading['FeatureSubType'] = "hybrid"
            reading['SensorName'] = "databoat"
            success, value = ingest_data("sensor", reading)
            if not success:
                log.error("--> failed: %s" % value)            
                return None, value
    except Exception as e:
        log.error("--> failed: %s" % log.exc(e))
        return None, "Unexpected format"   
    return True


