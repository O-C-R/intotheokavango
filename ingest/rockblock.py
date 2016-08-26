import json, codecs, os
from ingest import ingest_form_vars
from housepy import config, log, util, strings

def parse(request):
    log.info("rockblock.parse")

    try:
        data = ingest_form_vars(request)
        data = codecs.decode(data['data'], "hex").decode('utf-8')
    except Exception as e:
        log.error(log.exc(e))
        return None, "Parsing error"

    label_sets = [  ['t_utc', 'Station', 'Temp', 'Humidity', 'Pressure', 'WindSpeed2m', 'WindDir2m', 'WindGust10m', 'WindGustDir1m', 'DailyRain'],
                    ['t_utc', 'Station', 'Temp', 'Humidity', 'Pressure', 'WindSpeed2m', 'WindDir2m', 'WindGust10m', 'WindGustDir1m', 'DailyRain', 'Battery'],
                    ['t_utc', 'Station', 'Latitude', 'Longitude', 'Altitude', 'Uptime'],
                    ['t_utc', 'Station', 'Battery', 'ORP', 'pH', 'DO', 'Ec', 'Tds', 'Sal', 'Sg', '0', '0', '0', 'WaterT']
                    ]
    values = data.split(",")
    labels = None
    for label_set in label_sets:
        if len(values) == len(label_set):
            labels = label_set
            break
    if labels is None:
        log.error("Message type not recognized, length not matched")
        log.debug(values)
        return None, "Message type not recognized, length not matched"
    feature = {'FeatureType': "sensor", 'Delivery': "rockblock"}
    for l, label in enumerate(labels):
        if label == '0':
            continue
        feature[label] = strings.as_numeric(values[l])
    log.debug(feature)

    return feature
