from housepy import config, log, strings, net, util
from ingest import ingest_plain_body
from pymongo import ASCENDING, DESCENDING
from housepy.server import Application

def parse(request):
    log.info("sensor.parse")
    try:
        message = ingest_plain_body(request)
        data = net.urldecode(message)    
        log.debug(data)
        body = data['Body']
        content = strings.singlespace(body)
        tokens = content.split(" ")

        if tokens[0] == 'location':
            lon, lat = tokens[3], tokens[2]   ## note reversal                        
            # insert a record for this location update
            data = {'t_utc': util.timestamp(), 'SensorName': tokens[1], 'longitude': lon, 'latitude': lat, 'LocationUpdate': True}

        else:
            # find the most recent location update for this sensor
            db = Application.instance.db            
            results = list(db.features.find({'properties.FeatureType': "sensor", 'properties.SensorName': tokens[1], 'properties.LocationUpdate': True}).sort([('properties.t_utc', DESCENDING)]).limit(1))
            georef = results[0] if len(results) else None
            geometry = georef['geometry'] if georef is not None else None
            log.debug(geometry)
            data = {'t_utc': tokens[0], 'SensorName': tokens[1], strings.camelcase(tokens[2]): tokens[3], 'LocationUpdate': False, 'geometry': geometry}

    except Exception as e:
        log.error("Twilio post is malformed: %s" % log.exc(e))
        return None
    return data

"""
if a sensor is placed without geometry, it will get picked up in the estimator

assigning a location defines the geometry from then on out
and any retroactive ones that are estimated

"""