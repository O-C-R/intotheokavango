import json, codecs, os
from ingest import ingest_form_vars
from housepy import config, log, util, strings
from mongo import db, DESCENDING

def parse(request):
    log.info("rockblock.parse")

    try:
        data = ingest_form_vars(request)
        data = codecs.decode(data['data'], "hex").decode('utf-8')
    except Exception as e:
        log.error(log.exc(e))
        return None, "Parsing error"

    try:
        values = data.split(",")
        if values[2] == 'ST':
            labels = 't_utc','Station','MessageType','VBat','Charge','HasSd','HasGps','BatSleep','DeepSleep','TxFailures','TxSkipped','WeatherReceived','AtlasReceived','SonarReceived','DeadFor','AvgTxTime'
        elif values[2] == 'WE':
            labels = 't_utc','Station','MessageType','VBat','Charge','Temp','Hum','Press','WindSpeed2','WindDir2','WindGust10','WindGustDir10','DailyRain'
        elif values[2] == 'AT':
            labels = 't_utc','Station','MessageType','VBat','Charge','NOP','Orp','Do','Ph','EC1','EC2','EC3','EC4','WaterTemp'      # WaterTemp was lost
        elif values[2] == 'LO':        
            labels = 't_utc','Station','MessageType','VBat','Charge','Latitude','Longitude','Altitude','Uptime'
        elif values[2] == 'SO':
            labels = 't_utc','Station','MessageType','VBat','Charge','NOP','WaterLevelInM1','WaterLevelInM2','WaterLevelInM3','WaterLevelInM4','WaterLevelInM5'
        else:
            raise ValueError("Message type not recognized")

        feature = {'FeatureType': "sensor", 'Delivery': "rockblock"}
        for l, label in enumerate(labels):
            feature[label] = strings.as_numeric(values[l])
            if feature[label] == "NaN":
                feature[label] = None

        try:
            if 'Latitude' not in feature and 'Station' in feature:
                result = db.features.find({'properties.Station': feature['Station'], 'geometry.coordinates': {'$ne': None}}).sort([('properties.t_utc', DESCENDING)]).limit(1)[0]
                feature['Latitude'], feature['Longitude'] = result['geometry']['coordinates'][1], result['geometry']['coordinates'][0]
        except Exception as e:
            log.warning(log.exc(e))

        log.debug(feature)

        return feature

    except Exception as e:
        log.warning(log.exc(e))
        log.info("Trying previous schema...")
        
    try:            
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
            if feature[label] == "NaN":
                feature[label] = None

        try:
            if 'Latitude' not in feature and 'Station' in feature:
                result = db.features.find({'properties.Station': feature['Station'], 'geometry.coordinates': {'$ne': None}}).sort([('properties.t_utc', DESCENDING)]).limit(1)[0]
                feature['Latitude'], feature['Longitude'] = result['geometry']['coordinates'][1], result['geometry']['coordinates'][0]
        except Exception as e:
            log.warning(log.exc(e))
            
        log.debug(feature)
        return feature
    except Exception as e:
        log.error(log.exc(e))
        return None, "Could not parse"
