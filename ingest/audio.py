import soundcloud, time
from tornado import gen, web
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

@gen.coroutine
def parse(request):
    log.info("audio.parse")
    path = save_file(request) 
    if path is None:
        return None
    date_string = path.split('/')[-1].split('.')[0].split('_')[-2]
    log.debug("date_string %s" % date_string)
    dt = util.parse_date(date_string, tz=config['local_tz'])
    t = util.timestamp(dt)

    """Would be nice to have Member with this"""
    soundcloud_url = yield gen.Task(post_track, path)
    log.debug("yielded")
    if soundcloud_url is None:
        return None

    log.debug("moving on")
    log.debug(type(soundcloud_url))

    data = {'t_utc': t, 'FeatureType': "audio", 'SoundCloud': soundcloud_url}
    return data


"""how do I make this asynchronous?"""
def post_track(path):
    log.info("Posting %s to soundcloud..." % path)
    time.sleep(5)
    return "http://soundcloud.com/brianhouse/test"
    # try:
    #     with open(path, 'rb') as f:
    #         track = {'asset_data': f, 'sharing': "public", 'title': "test"}
    #         track = client.post('/tracks', track=track)
    #         soundcloud_url = track.permalink_url
    # except Exception as e:
    #     log.error("--> could not post track to SoundCloud: %s" % log.exc(e))
    #     return None
    # log.info("--> success: %s" % soundcloud_url)
    # return soundcloud_url


"""
this is blocking.

"""