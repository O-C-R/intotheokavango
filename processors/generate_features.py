#!/usr/bin/env python3

import json, os
from housepy import config, log, util, strings
from mongo import db

"""Produces journal.json"""

def main():    
    return # disabled for now
    log.info("generate_features")

    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static", "data", "json", "journal.json"))

    """
    Filters for finding great content go here

    Should also flag the content

    """

    data = {"test": "data"}

    try:
        with open(path, 'w') as f:
            f.write(json.dumps(data))
    except Exception as e:
        log.error("--> could not write journal.json: %s" % log.exc(e))


main()