from ingest import ingest_plain_body
from housepy import config, log, strings, util, net

def parse(request):
    log.info("beacon.parse")
    content = ingest_plain_body(request)
    if content is None:
        return content, "Could not parse"

    data = {}
    lines = content.split('\n')
    for line in lines:
        log.debug("%s" % line)
        try:
            if "sat4rent" in line.lower():
                data['Satellite'] = line[-8:].upper()
            if "Position Time:" in line:
                line = line.replace("Position Time:", "").strip()
                dt = util.parse_date(line)
                t = util.timestamp(dt)
                data['t_utc'] = t
            if "Map:" in line:
                line = line.split('?')[1].strip()
                result = net.urldecode(line)
                lat, lon = result['q'].split(' ')[0].split(',')
                data['longitude'], data['latitude'] = strings.as_numeric(lon), strings.as_numeric(lat)
            if "Altitude:" in line:
                altitude = strings.as_numeric(line.replace("Altitude:", "").replace("meters", "").strip())
                data['altitude'] = altitude
            if "Speed:" in line:
                speed = strings.as_numeric(line.replace("Speed:", "").replace("Knots", "").strip())
                data['Speed'] = speed
            if "Heading:" in line:
                heading = strings.as_numeric(line.replace("Heading:", "").replace("°", "").strip())
                data['Heading'] = heading
        except Exception as e:
            log.error(log.exc(e))
            continue

    return data
