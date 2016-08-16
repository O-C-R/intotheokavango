import json
from housepy import util, log, config, strings
from ingest import ingest_json_body, ingest_data

def parse(request):
    log.info("databoat.parse")
    data = ingest_json_body(request)
    try:
        for key, reading in data.items():
            t_local = strings.as_numeric(reading['t_local'])
            reading = reading['data']        
            log.debug(json.dumps(reading, indent=4, default=lambda x: str(x)))
            if 'gps_long' in reading and 'gps_lat' in reading:
                reading['Longitude'] = reading['gps_long']
                del reading['gps_long']
                reading['Latitude'] = reading['gps_lat']
                del reading['gps_lat']
            reading['FeatureType'] = "sensor"
            reading['FeatureSubType'] = "hybrid"
            reading['SensorName'] = "databoat"
            reading['t_utc'] = util.delocalize_timestamp(t_local, tz=config['local_tz'])
            success, value = ingest_data("sensor", reading)
            if not success:
                log.error("--> failed: %s" % value)            
    except Exception as e:
        log.error("--> failed: %s" % log.exc(e))
        return None, "Unexpected format"   
    return True


"""
{ t_local: '1429805254',
 data: 
  { dissolved_oxygen: '9.79',
    orp: '202.2',
    salinity: '0.00',
    ph: '3.747',
    conductivity: '0',
    'water temp': '0' },
 t_utc: 1429805257 }

"""