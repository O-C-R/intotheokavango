import time, json
from tornado import gen, web
from housepy import log, util, config, strings
from ingest import save_files

"""Expecting JSON or form metadata with Member and a timestamp in UTC"""

def parse(request):
    log.info("video.parse")

    paths = save_files(request)
    if not len(paths):
        return None, "No files"

    # process the json
    data = None
    for path in paths:
        if path[-4:] == "json":
            try:
                with open(path, encoding='utf-8') as f:
                    data = json.loads(f.read())
            except Exception as e:
                log.error(log.exc(e))
                return None, "Could not parse"
            break
    if data is None:
        return None, "No data"          

    # process the video
    for path in paths:
        if path[-4:] != "json":
            break

    if 'TeamMember' in data:
        data['Member'] = data['TeamMember']
        del data['TeamMember']              

    data['Title'] = strings.titlecase(data['Title'])
    data['UploadPath'] = path.split('/')[-1]
    data['YouTubeURL'] = None

    return data
