import json, xmltodict
from ingest import ingest_json_body
from housepy import config, log, strings, util

def parse(request):
    log.info("beacon.parse")
    properties = {}
    coordinates = [None, None, None]
    t = None
    try:
        lines = content.split('\n')
        for line in lines:
            log.debug("%s" % line)
            try:
                if "Position Time:" in line:
                    line = line.replace("Position Time:", "").strip()
                    dt = util.parse_date(line)
                    t = util.timestamp(dt)
                    properties['t_utc'] = t
                if "Map:" in line:
                    line = line.split('?')[1].strip()
                    result = net.urldecode(line)
                    lat, lon = result['q'].split(' ')[0].split(',')
                    coordinates[0], coordinates[1] = strings.as_numeric(lon), strings.as_numeric(lat)
                if "Altitude:" in line:
                    altitude = strings.as_numeric(line.replace("Altitude:", "").replace("meters", "").strip())
                    coordinates[2] = altitude
                if "Speed:" in line:
                    speed = strings.as_numeric(line.replace("Speed:", "").replace("Knots", "").strip())
                    properties['Speed'] = speed
                if "Heading:" in line:
                    heading = strings.as_numeric(line.replace("Heading:", "").replace("°", "").strip())
                    properties['Heading'] = heading
            except Exception as e:
                log.error(log.exc(e))
                continue

        feature = geojson.Feature(geometry={'type': "Point", 'coordinates': coordinates}, properties=properties)
        feature_id = model.insert_feature('beacon', t, geojson.dumps(feature))
    except Exception as e:
        log.error(log.exc(e))

