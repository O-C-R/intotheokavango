import pytz
from housepy import config, log, strings, net, util
from ingest import ingest_plain_body
from pymongo import ASCENDING, DESCENDING
from housepy.server import Application
from twilio.rest import TwilioRestClient

def parse(request):
    log.info("sensor.parse")
    try:
        message = ingest_plain_body(request)
        data = net.urldecode(message)    
        log.debug(data)
        number = data['From']
        body = data['Body']
        content = strings.singlespace(body.strip())

        label_sets = [  ['t_utc', 'Station', 'Temp', 'Humidity', 'Pressure', 'WindSpeed2m', 'WindDir2m', 'WindGust10m', 'WindGustDir1m', 'DailyRain'],
                        ['t_utc', 'Station', 'Temp', 'Humidity', 'Pressure', 'WindSpeed2m', 'WindDir2m', 'WindGust10m', 'WindGustDir1m', 'DailyRain', 'Battery'],
                        ['t_utc', 'Station', 'Latitude', 'Longitude', 'Altitude'],
                        ['t_utc', 'Station', 'Battery', 'ORP', 'pH', 'DO', 'Ec', 'Tds', 'Sal', 'Sg', '0', '0', '0', 'WaterT']
                        ]
        values = content.split(",")
        labels = None
        for label_set in label_sets:
            if len(values) == len(label_set):
                labels = label_set
                break
        if labels is None:
            log.error("Message type not recognized, length not matched")
            log.debug(values)
            return None, "Message type not recognized, length not matched"
        feature = {'FeatureType': "sensor", 'Delivery': "twilio"}
        for l, label in enumerate(labels):
            if label == '0':
                continue
            feature[label] = strings.as_numeric(values[l])
        log.debug(feature)

    except Exception as e:
        log.error("Twilio post is malformed: %s" % log.exc(e))
        return None, "Twilio post is malformed"        
    return data


# ## this should be async
# def send_sms(number, sensor_name, lon, lat):
#     message = "Successfully updated location of %s to %s,%s" % (sensor_name, lat, lon)
#     log.info("Sending message: %s" % message)
#     settings = config['twilio']
#     try:
#         client = TwilioRestClient(settings['account_sid'], settings['auth_token'])
#         response = client.messages.create(body=message, to=number, from_=settings['number']) # Replace with your Twilio number
#         log.info(response.sid)
#     except Exception as e:
#         log.error(log.exc(e))
