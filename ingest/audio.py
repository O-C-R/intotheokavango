import soundcloud, time, json
from tornado import gen, web
from housepy import log, util, config
from ingest import save_files

"""Expecting JSON or form metadata with Member and a timestamp in UTC"""

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

    paths = save_files(request)
    if not len(paths):
        return None

    # process the json
    data = None
    for path in paths:
        if path[-4:] == "json":
            try:
                with open(path) as f:
                    data = json.loads(f.read())
            except Exception as e:
                log.error(log.exc(e))
                return None
            break
    if data is None:
        return None            

    # process the audio
    for path in paths:
        if path[-4:] != "json":
            break

    """Would be nice to have Member with this"""
    soundcloud_url = post_track(path)#yield gen.Task(post_track, path)
    log.debug("yielded")
    if soundcloud_url is None:
        return None
    data['SoundCloudURL'] = soundcloud_url
    return data


"""how do I make this asynchronous?"""
def post_track(path):
    log.info("Posting %s to soundcloud..." % path)
    # time.sleep(5)
    # return "http://soundcloud.com/brianhouse/test"
    try:
        with open(path, 'rb') as f:
            track = {'asset_data': f, 'sharing': "public", 'title': "test"}
            track = client.post('/tracks', track=track)
            soundcloud_url = track.permalink_url
    except Exception as e:
        log.error("--> could not post track to SoundCloud: %s" % log.exc(e))
        return None
    log.info("--> success: %s" % soundcloud_url)
    return soundcloud_url


"""
this is blocking. shouldnt be.

"""