import pytz
from housepy import config, log, strings, net, util
from ingest import ingest_plain_body
from pymongo import ASCENDING, DESCENDING
from housepy.server import Application
from twilio.rest import TwilioRestClient

"""
Receive sensor data via SMS in the format `<time> <SensorName> <Reading> <value>`
Send an SMS in the format `location <SensorName> <Latitude> <Longitude>` to update 
geometry for that sensor going forward

If time is '*', then have the server generate the timestamp.

The time is reported in local time.

"""

def parse(request):
    log.info("sensor.parse")
    try:
        message = ingest_plain_body(request)
        data = net.urldecode(message)    
        log.debug(data)
        number = data['From']
        body = data['Body']
        content = strings.singlespace(body.strip())

        # 1436477098,Lat,-18.111946,Long,21.665733,TDS,4.000,Sal,0.000,WatTemp,16.88,AirTemp,18.50,Hum,48.90
        tokens = content.split(',')
        t = util.delocalize_timestamp(strings.as_numeric(tokens[0]), config['local_tz'])        
        data = {'t_utc': t, 'FeatureType': "sensor", 'Delivery': "twilio"}
        tokens = tokens[1:]
        keys = tokens[0::2]
        values = tokens[1::2]
        for k, key in enumerate(keys):
            data[strings.camelcase(key)] = strings.as_numeric(values[k])


        # tokens = content.split(" ")

        # if tokens[0] == 'location':
        #     lon, lat = tokens[3], tokens[2]   ## note reversal                        
        #     # insert a record for this location update
        #     data = {'t_utc': util.timestamp(), 'SensorName': tokens[1], 'longitude': lon, 'latitude': lat, 'LocationUpdate': True}

        #     # send a verification
        #     send_sms(number, tokens[1], lon, lat)

        # else:
        #     # find the most recent location update for this sensor
        #     db = Application.instance.db            
        #     results = list(db.features.find({'properties.FeatureType': "sensor", 'properties.SensorName': tokens[1], 'properties.LocationUpdate': True}).sort([('properties.t_utc', DESCENDING)]).limit(1))
        #     georef = results[0] if len(results) else None
        #     geometry = georef['geometry'] if georef is not None else None
        #     log.debug(geometry)
        #     if tokens[0] == "*":
        #         t = util.timestamp()
        #     else:                    
        #         t = util.delocalize_timestamp(tokens[0], config['local_tz']) # converts from local time timestamp to t_utc
        #     data = {'t_utc': t, 'SensorName': tokens[1], strings.camelcase(tokens[2]): tokens[3], 'LocationUpdate': False, 'geometry': geometry}

    except Exception as e:
        log.error("Twilio post is malformed: %s" % log.exc(e))
        return None
    return data


## this should be async
def send_sms(number, sensor_name, lon, lat):
    message = "Successfully updated location of %s to %s,%s" % (sensor_name, lat, lon)
    log.info("Sending message: %s" % message)
    settings = config['twilio']
    try:
        client = TwilioRestClient(settings['account_sid'], settings['auth_token'])
        response = client.messages.create(body=message, to=number, from_=settings['number']) # Replace with your Twilio number
        log.info(response.sid)
    except Exception as e:
        log.error(log.exc(e))