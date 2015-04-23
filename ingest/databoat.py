from housepy import util, log, config
from ingest import ingest_json_file, ingest_data

def parse(request):
    log.info("databoat.parse")
    data = ingest_json_file(request)
    log.info("Ingesting %s readings..." % len(data))
    for reading in data:
        log.debug(reading)
        try:
            reading['FeatureType'] = "sensor"
            reading['FeatureSubType'] = "hybrid"
            reading['SensorName'] = "DataBoat"
            reading['LocationUpdate'] = False
            reading['t_utc'] = util.delocalize_timestamp(reading['t_local'], tz=config['local_tz'])
            success, value = ingest_data(reading)
            if not success:
                log.error("--> failed: %s" % value)
            else:
                log.info("--> %s" % value)
        except Exception as e:
            log.error("--> failed: %s" % log.exc(e))
            continue        
    return True, "OK"
