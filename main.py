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


class Teams(server.Handler):

    def get(self, page=None):
        log.info("Teams.get")
        self.set_header("Access-Control-Allow-Origin", "*")
        members = []        
        satellites = config['satellites']        
        if page is None or not len(page):
            teams = [team for team in self.db.teams.find().sort('Name') if 'Name' in team and len(team['Name'])]
            for member in [name for name in self.db.members.find().sort('Name').distinct('Name') if len(name)]:
                result = list(self.db.members.find({'Name': member}).sort([('t_utc', DESCENDING)]).limit(1))
                team = None if not len(result) or 'Team' not in result[0] else result[0]['Team']
                members.append({'Name': member, 'Team': team})
            return self.render("teams.html", dbmembers=members, dbteams=teams, satellites=satellites)
        elif page in satellites:
            teamtags = list(self.db.satellites.find({'Name': page}).sort([('t_utc', ASCENDING)]))
            for t, teamtag in enumerate(teamtags):
                teamtags[t] = util.datestring(teamtag['t_utc'], config['local_tz']), teamtag['Team'] if 'Team' in teamtag else None
            return self.render("team_satellite.html", satellite=page, teamtags=teamtags)
        else:
            teamtags = list(self.db.members.find({'Name': page}).sort([('t_utc', ASCENDING)]))
            for t, teamtag in enumerate(teamtags):
                teamtags[t] = util.datestring(teamtag['t_utc'], config['local_tz']), teamtag['Team'] if 'Team' in teamtag else None
            members = [name for name in self.db.members.find().sort('Name').distinct('Name') if len(name)]
            return self.render("team_member.html", member=page, teamtags=teamtags, members=members)

    def post(self, nop=None):
        log.info("Team.post")
        new_team = self.get_argument('new_team', None)
        new_member = self.get_argument('new_member', None)
        member = self.get_argument('member', None)
        team = self.get_argument('team', None)
        satellite = self.get_argument('satellite', None)
        reassign_member = self.get_argument('reassign_member', None)
        target = self.get_argument('target', None)
        log.debug("new_team %s" % new_team)
        log.debug("new_member %s" % new_team)
        log.debug("member %s" % member)
        log.debug("team %s" % team)
        log.debug("satellite %s" % satellite)
        t = util.timestamp()      
        if new_member is not None:
            # borrowed from ingest code
            if new_member.lower() == "null" or new_member.lower() == "none" or len(new_member.strip()) == 0:
                new_member = None
            else:
                new_member = new_member.strip().split(' ')[0]
            if new_member is not None:
                new_member = new_member.title() if len(new_member) > 2 else new_member.upper()
                new_member = new_member.replace('\u00f6', 'oe') # sorry Goetz
            try:
                if not self.db.members.find({'Name': new_member}).count():
                    self.db.members.insert({'Name': new_member, 'Team': None, 't_utc': t})
                else:
                    log.info("--> already exists")
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad format")                    
            return self.text("OK")
        if new_team is not None:
            team = strings.camelcase(new_team.strip())
            log.info("Creating new team %s" % team)
            try:
                if not self.db.teams.find({'Name': team}).count():
                    self.db.teams.insert({'Name': team, 't_utc': t})
                else:
                    log.info("--> already exists")
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad format")    
            return self.text("OK")
        if satellite is not None and team is not None:
            log.info("Changing team %s to satellite %s" % (team, satellite))
            try:
                self.db.teams.update({'Satellite': satellite}, {'$set': {'Satellite': None}})
                if team == "NONE":
                    team = None
                else:
                    self.db.teams.update({'Name': team}, {'$set': {'Satellite': satellite}})
                self.db.satellites.insert({'Name': satellite, 'Team': team, 't_utc': t})                    
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad format")
            return self.text("OK")
        if member is not None and team is not None:
            log.info("Changing %s to team %s" % (member, team))
            if team == "NONE":
                team = None
            try:
                self.db.members.insert({'Name': member, 'Team': team, 't_utc': t})
            except Exception as e:
                log.error(log.exc(e))
                return self.error("Bad format")
            return self.text("OK")
        if reassign_member is not None and target is not None:
            log.info("Reassigning %s to %s" % (reassign_member, target))            
            try:
                result = self.db.features.update({'properties.Member': reassign_member}, {'$set': {'properties.Member': target}}, multi=True)
                log.debug(result)
                result = self.db.members.remove({'Name': reassign_member})
                log.debug(result)
            except Exception as e:
                log.error(log.exc(e))
                return self.error(e)  
            return self.text("OK")              
        return self.error("Something wasn't right")
        

handlers = [
    (r"/teams/?([^/]*)", Teams),
    (r"/api/?([^/]*)/?([^/]*)", Api),
    (r"/ingest/?([^/]*)", Ingest),
    (r"/?([^/]*)", Home),    
]    

server.start(handlers)
