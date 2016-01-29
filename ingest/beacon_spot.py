import json
from ingest import ingest_xml_body
from housepy import config, log, strings, util, net

def parse(request):
    log.info("beacon_spot.parse")
    content = ingest_xml_body(request)
    if content is None:
        return content, "Could not parse"

    print(request.headers)

    data = {'FeatureType': "beacon"}
    try:
        content = content['messageList']['message'][0]
        data['latitude'] = float(content['latitude'])
        data['longitude'] = float(content['longitude'])
        data['t_utc'] = int(content['timeInGMTSecond'])
        data['Satellite'] = content['esnName']
        data['ESN'] = content['esn']
        data['ID'] = content['id']
        data['MessageType'] = content['messageType']
        data['MessageDetail'] = content['messageDetail']
    except Exception as e:
        log.error(log.exc(e))
        log.error(content)

    return data


"""
        "id": "43244556",
        "esn": "0-7341007",
        "esnName": "Jono SPOT",
        "messageType": "TEST",
        "messageDetail": "This is a Test message. The device is powered\non and is working.",
        "timestamp": "2008-05-20T10:52:55.000-07:00",
        "timeInGMTSecond": "1211305975",
        "latitude": "37.425",
        "longitude": "-121.8958"

"""