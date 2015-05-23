#!/usr/bin/env python3

import http.client, httplib2, os, random, sys, time, json, io, tempfile
from apiclient.discovery import build
from apiclient.errors import HttpError
from apiclient.http import MediaFileUpload
from oauth2client.client import flow_from_clientsecrets
from oauth2client.file import Storage
from oauth2client.tools import argparser, run_flow
from housepy import config, log
from mongo import db

YOUTUBE_UPLOAD_SCOPE = "https://www.googleapis.com/auth/youtube.upload"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def main():
    features = db.features.find({'properties.FeatureType': "video", 'YouTubeURL': None})
    for feature in features:
        try:
            options = { 'file': os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", feature['properties']['UploadPath'])),
                        'title': feature['properties']['Title'],
                        'description': feature['properties']['Notes'] if 'Notes' in feature['properties'] else ""
                        }
        except Exception as e:
            log.error(log.exc(e))
        try:
            youtube_id = upload(get_authenticated_service(options), options)
            youtube_url = "https://www.youtube.com/watch?v=%s" % youtube_id
            db.features.update({'_id': feature['_id']}, {'$set': {'properties.YouTubeURL': youtube_url}})
        except HttpError as e:
            data = json.loads(e.content.decode('utf-8'))
            log.error("An HTTP error %d occurred:\n%s" % (e.resp.status, json.dumps(data, indent=4)))


def get_authenticated_service(args):
    log.info("youtube.get_authenticated_service")
    with tempfile.NamedTemporaryFile() as temp:
        temp.write(client_secrets.encode('utf-8'))
        temp.flush()    
        flow = flow_from_clientsecrets(temp.name, scope=YOUTUBE_UPLOAD_SCOPE, message="missing client_secrets.json")
    storage = Storage("%s-oauth2.json" % sys.argv[0])
    credentials = storage.get()
    if credentials is None or credentials.invalid:
        credentials = run_flow(flow, storage, argparser.parse_args())
    auth = credentials.authorize(httplib2.Http())
    return build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, http=auth)

def upload(youtube, options):
    log.info("youtube.upload %s" % options['file'])
    body = {'snippet': {'title': options['title'], 
                        'description': options['description'], 
                        'categoryId': 22, 
                        'status': {'privacyStatus': "public"}
                        }
            }
    insert_request = youtube.videos().insert(part=",".join(list(body.keys())), body=body, media_body=MediaFileUpload(options['file'], chunksize=-1, resumable=True))
    try:
        log.info("Uploading file...")
        status, response = insert_request.next_chunk()
        if 'id' in response:
            log.info("--> video id '%s' was successfully uploaded" % response['id'])
            return response['id']
        else:
            log.error("--> the upload failed with an unexpected response: %s" % response)
    except HttpError as e:
        log.error(e)

client_secrets = """
{
  "web": {
    "client_id": "%s",
    "client_secret": "%s",
    "redirect_uris": [],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token"
  }
}
""" % (config['youtube']['client_id'], config['youtube']['client_secret'])

main()