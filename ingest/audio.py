import soundcloud
from tornado import gen
from housepy import log, util, config
from ingest import save_file

settings = config['soundcloud']
try:
    client = soundcloud.Client(
        client_id=settings['client_id'],
        client_secret=settings['client_secret'],
        username=settings['email'],
        password=settings['password']
    )
except Exception as e:
    log.error("Could not establish SoundCloud client: %s" % log.exc(e))


def parse(request):
    log.info("audio.parse")
    path = save_file(request) 
    date_string = path.split('/')[-1].split('.')[0]
    dt = datetime.datetime.strptime(date_string.split('_')[0], "%d%m%Y%H%M")
    tz = pytz.timezone(config['local_tz'])
    dt = tz.localize(dt)
    t = util.timestamp(dt)

    """Would be nice to have Member with this"""

    soundcloud_url = post_track(path)
    if soundcloud_url is None:
        return None

    data = {'utc_t': t, 'FeatureType': "audio", 'SoundCloud': soundcloud_url}
    return data


@gen.coroutine
def post_track(path):
    try:
        with open(path, 'rb') as f:
            track = {'asset_data': f}
            track = client.post('/tracks', track=track)
            soundcloud_url = track.url
    except Exception as e:
        log.error("Could not post track to SoundCloud: %s" % log.exc(e))
        return None
    return soundcloud_url

