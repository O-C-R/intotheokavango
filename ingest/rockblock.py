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

    values = data.split(",")
    if value[0] == 'ST':
        labels = 'VBat','Charge','HasSd','HasGps','BatSleep','DeepSleep','TxFailures','TxSkipped','WeatherReceived','AtlasReceived','SonarReceived','DeadFor','AvgTxTime'
    elif value[0] == 'WE':
        labels = 'VBat','Charge','Temp','Hum','Press','WindSpeed2','WindDir2','WindGust10','WindGustDir10','DailyRain'
    elif value[0] == 'AT':
        labels = 'Kind','VBat','Charge','Temp','Hum','Press','WindSpeed2','WindDir2','WindGust10','WindGustDir10','DailyRain'
    elif value[0] == 'LO':        
        labels = 'VBat','Charge','Lat','Lon','Alt','Uptime'
    else:
        log.error("Message type not recognized")
        log.debug(values)
        return None, "Message type not recognized"

    values = values[1:]

    feature = {'FeatureType': "sensor", 'Delivery': "rockblock"}
    for l, label in enumerate(labels):
        feature[label] = strings.as_numeric(values[l])
    log.debug(feature)

    return feature
