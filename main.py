#!/usr/bin/env python3

import os, sys
from housepy import config, log, server, util, process
from pymongo import ASCENDING, DESCENDING
from ingest import Ingest
from api import Api

process.secure_pid(os.path.abspath(os.path.join(os.path.dirname(__file__), "run")), sys.argv[1])

class Home(server.Handler):

    def get(self, page=None):
        self.set_header("Access-Control-Allow-Origin", "*")
        if len(page):
            try:
                return self.render("%s.html" % page)
            except Exception as e:
                log.error(log.exc(e))
                return self.not_found()        
        return self.render("indexTeaser.html")


class Core(server.Handler):

    def get(self, page=None):
        log.info("Core.get")
        self.set_header("Access-Control-Allow-Origin", "*")
        members = []
        for member in config['members']:
            result = list(self.db.members.find({'Name': member}).sort([('t_utc', DESCENDING)]).limit(1))
            if not len(result) or 'Core' not in result[0]:
                core = False
            else:
                core = result[0]['Core']
            members.append({'Name': member, 'Core': core})
        return self.render("core.html", dbmembers=members)

    def post(self, nop=None):
        log.info("Core.post")
        try:
            for member, status in self.request.arguments.items():
                status = True if status[0].decode('utf-8') == "true" else False
                t = util.timestamp()
                log.debug("%s %s %s" % (member, status, t))
                self.db.members.insert({'Name': member, 'Core': status, 't_utc': t})
        except Exception as e:
            self.error(log.exc(e))
            return self.error("Bad format")
        return self.text("OK")


handlers = [
    (r"/setCore", Core),
    (r"/api/?([^/]*)/?([^/]*)", Api),
    (r"/ingest/?([^/]*)", Ingest),
    (r"/?([^/]*)", Home),    
]    

server.start(handlers)
