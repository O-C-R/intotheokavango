#!/usr/bin/env python3

import os, sys, yaml, json
from housepy import config, log, server, util, process, strings
from ingest import Ingest
from api import Api
from mongo import ObjectId

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


class Upload(server.Handler):

    def get(self, page=None):
        self.set_header("Access-Control-Allow-Origin", "*")
        if len(page):
            try:
                return self.render("upload/%s.html" % page)
            except Exception as e:
                log.error(log.exc(e))
                return self.not_found()        
        return self.render("upload/home.html")


class Admin(server.Handler):

    def get(self, page=None):
        log.info("Admin.get")
        self.set_header("Access-Control-Allow-Origin", "*")
        members = []        
        satellites = config['satellites']   
        ambits = config['ambits'].copy()   
        if page is None or not len(page):
            teams = [team for team in self.db.teams.find().sort('Name') if 'Name' in team and len(team['Name'])]
            for member in [name for name in self.db.members.find().sort('Name').distinct('Name') if len(name)]:
                result = list(self.db.members.find({'Name': member}).sort([('t_utc', DESCENDING)]).limit(1))
                team = None if not len(result) or 'Team' not in result[0] else result[0]['Team']
                members.append({'Name': member, 'Team': team})
            for a, ambit in enumerate(ambits):
                result = list(self.db.ambits.find({'Serial': ambit}).sort([('t_utc', DESCENDING)]).limit(1))
                ambits[a] = {'Serial': ambit} if not len(result) or 'Serial' not in result[0] else result[0]
            return self.render("admin/home.html", dbmembers=members, dbteams=teams, satellites=satellites, dbambits=ambits)
        elif page in satellites:
            teamtags = list(self.db.satellites.find({'Name': page}).sort([('t_utc', ASCENDING)]))
            for t, teamtag in enumerate(teamtags):
                teamtags[t] = util.datestring(teamtag['t_utc'], config['local_tz']), teamtag['Team'] if 'Team' in teamtag else None
            return self.render("admin/satellite.html", satellite=page, teamtags=teamtags)
        elif page in ambits:
            ambittags = list(self.db.ambits.find({'Serial': page}).sort([('t_utc', ASCENDING)]))
            for a, ambittag in enumerate(ambittags):
                ambittags[a] = util.datestring(ambittag['t_utc'], config['local_tz']), ambittag['Member']
            return self.render("admin/ambit.html", ambit=page, ambittags=ambittags)            
        else:
            teamtags = list(self.db.members.find({'Name': page}).sort([('t_utc', ASCENDING)]))
            for t, teamtag in enumerate(teamtags):
                teamtags[t] = util.datestring(teamtag['t_utc'], config['local_tz']), teamtag['Team'] if 'Team' in teamtag else None
            members = [name for name in self.db.members.find().sort('Name').distinct('Name') if len(name)]
            return self.render("admin/member.html", member=page, teamtags=teamtags, members=members)

    def post(self, nop=None):
        log.info("Admin.post")
        new_team = self.get_argument('new_team', None)
        new_member = self.get_argument('new_member', None)
        member = self.get_argument('member', None)
        team = self.get_argument('team', None)
        satellite = self.get_argument('satellite', None)
        ambit = self.get_argument('ambit', None)        
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
        if member is not None and ambit is not None:
            log.info("Assigning ambit %s to member %s" % (ambit, member))
            if ambit == "NONE":
                ambit = None
            try:
                self.db.ambits.insert({'Serial': ambit, 'Member': member, 't_utc': t})
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
        


class Edit(server.Handler):

    def get(self, feature_id=None):
        log.info("Edit.get")
        self.set_header("Access-Control-Allow-Origin", "*")
        if feature_id is None or not len(feature_id):
            return self.error("Missing feature_id")
        feature = self.db.features.find_one({'_id': ObjectId(feature_id)})
        if feature is None:
            return self.error("feature_id (%s) not found" % feature_id)
        try:
            safe_feature = json.loads(json.dumps(feature, indent=4, default=lambda obj: str(obj)))
            yml = yaml.safe_dump(safe_feature)            
        except Exception as e:
            return self.error(log.exc(e))
        return self.text(yml)


    def post(self, nop=None):
        log.info("Edit.post")


handlers = [
    (r"/edit/?([^/]*)", Edit),
    (r"/admin/?([^/]*)", Admin),
    (r"/upload/?([^/]*)", Upload),
    (r"/api/?([^/]*)/?([^/]*)", Api),
    (r"/ingest/?([^/]*)", Ingest),
    (r"/?([^/]*)", Home),    
]    

server.start(handlers)