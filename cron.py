#!/usr/bin/env python3

import os, importlib
from housepy import config, log, util, process

process.secure_pid(os.path.abspath(os.path.join(os.path.dirname(__file__), "run")))

for filename in os.listdir(os.path.abspath(os.path.join(os.path.dirname(__file__), "processors"))):
    if filename[0] == "_" or filename[-3:] != ".py":
        continue
    try:
        module_name = "processors.%s" % filename.split('.')[0]
        log.info("Loading %s module..." % module_name)
        importlib.import_module(module_name)
        log.info("--> done")
    except Exception as e:
        log.error(log.exc(e))
        continue