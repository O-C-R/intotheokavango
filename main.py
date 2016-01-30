#!/usr/bin/env python3

import os, sys
from housepy import config, log, server, util, process, strings
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
        return self.render("index2.html")


class Core(server.Handler):

    def get(self, page=None):
        log.info("Core.get")
        self.set_header("Access-Control-Allow-Origin", "*")
        if page is None or not len(page):
            members = []
            for member in config['members']:
                result = list(self.db.members.find({'Name': member}).sort([('t_utc', DESCENDING)]).limit(1))
                if not len(result) or 'Core' not in result[0]:
                    core = False
                else:
                    core = result[0]['Core']
                members.append({'Name': member, 'Core': core})
            return self.render("core.html", dbmembers=members)
        else:
            coretags = list(self.db.members.find({'Name': page}).sort([('t_utc', ASCENDING)]))
            for c, coretag in enumerate(coretags):
                coretags[c] = util.datestring(coretag['t_utc'], config['local_tz']), coretag['Core'] if 'Core' in coretag else False
            return self.render("core_member.html", member=page, coretags=coretags)

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


class Teams(server.Handler):

    def get(self, page=None):
        log.info("Teams.get")
        self.set_header("Access-Control-Allow-Origin", "*")
        members = []        
        if page is None or not len(page):
            teams = list(self.db.teams.find().sort('Name').distinct('Name'))
            for member in list(self.db.members.find().sort('Name').distinct('Name')):
                result = list(self.db.members.find({'Name': member}).sort([('t_utc', DESCENDING)]).limit(1))
                if not len(result) or 'Team' not in result[0]:
                    team = None
                else:
                    team = result[0]['Team']
                members.append({'Name': member, 'Team': team})
            return self.render("teams.html", dbmembers=members, dbteams=teams)
        else:
            teamtags = list(self.db.members.find({'Name': page}).sort([('t_utc', ASCENDING)]))
            for t, teamtag in enumerate(teamtags):
                teamtags[t] = util.datestring(teamtag['t_utc'], config['local_tz']), teamtag['Team'] if 'Team' in teamtag else None
            return self.render("team_member.html", member=page, teamtags=teamtags)

    def post(self, nop=None):
        log.info("Team.post")
        new_team = self.get_argument('new_team', None)
        member = self.get_argument('member', None)
        team = self.get_argument('team', None)
        log.debug("new_team %s" % new_team)
        log.debug("member %s" % member)
        log.debug("team %s" % team)
        t = util.timestamp()            
        if new_team is not None:
            team = strings.camelcase(new_team.strip())
            log.info("Creating new team %s" % team)
            try:
                self.db.teams.insert({'Name': team, 't_utc': t})
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad format")
        if member is not None and team is not None:
            log.info("Changing %s to team %s" % (member, team))
            if team == "NONE":
                team = None
            try:
                self.db.members.insert({'Name': member, 'Team': team, 'Core': False, 't_utc': t})
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad format")
            return self.text("OK")
        return self.error("Something wasn't right")

        # try:
        #     for member, status in self.request.arguments.items():
        #         status = True if status[0].decode('utf-8') == "true" else False
        #         t = util.timestamp()
        #         log.debug("%s %s %s" % (member, status, t))
        #         self.db.members.insert({'Name': member, 'Core': status, 't_utc': t})
        # except Exception as e:
        #     self.error(log.exc(e))
        #     return self.error("Bad format")
        

handlers = [
    (r"/teams/?([^/]*)", Teams),
    (r"/setCore/?([^/]*)", Core),
    (r"/api/?([^/]*)/?([^/]*)", Api),
    (r"/ingest/?([^/]*)", Ingest),
    (r"/?([^/]*)", Home),    
]    

server.start(handlers)
