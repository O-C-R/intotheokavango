#!/usr/bin/env python3

import os
from housepy import config, log, server, util, process
from ingest import Ingest
from api import Api

process.secure_pid(os.path.abspath(os.path.join(os.path.dirname(__file__), "run")))

class Home(server.Handler):

    def get(self, page=None):
        if len(page):
            try:
                return self.render("%s.html" % page)
            except:
                return self.not_found()        
        return self.text(str(self.db))


handlers = [
    (r"/api/?([^/]*)", Api),
    (r"/ingest/?([^/]*)", Ingest),
    (r"/?([^/]*)", Home),    
]    

server.start(handlers)
