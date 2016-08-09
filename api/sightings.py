import geojson, datetime
from housepy import config, log, util
from collections import OrderedDict
from mongo import DESCENDING

""" list of days, with total counts across sightings for each one """

def assemble(self, search, limit, order, resolution):
    log.info("sightings.assemble")
    try:
        # results = OrderedDict()        
        results = []
        if 'properties.t_utc' not in search:
            if 'properties.Expedition' not in search:
                raise Exception("Date constraints are required")
            else:
                try:
                    start_date = util.parse_date(str(config['start_date'][search['properties.Expedition']]), tz=config['local_tz'])
                    last_feature = list(self.db.features.find({'properties.Expedition': search['properties.Expedition'], 'properties.t_utc': {'$gt': util.timestamp(start_date)}, 'properties.FeatureType': "beacon"}).sort([('properties.t_utc', DESCENDING)]).limit(1))[0]
                    end_date = util.parse_date(last_feature['properties']['DateTime'])
                    search['properties.t_utc'] = {'$gt': util.timestamp(start_date)}                    
                    search['properties.t_utc']['$lt'] = util.timestamp(end_date)
                except KeyError:
                    raise Exception("That expedition not recognized")
                except IndexError:
                    raise Exception("Date constraints are required")
        intervals = []
        t = search['properties.t_utc']['$gt']
        while t <= search['properties.t_utc']['$lt']:
            intervals.append(t)
            t += 86400
        for i, interval in enumerate(intervals[:-1]):
            s = search.copy()
            s['properties.t_utc']['$gt'] = interval            
            s['properties.t_utc']['$lt'] = intervals[i+1]
            try:
                count = list(self.db.features.aggregate([ {'$match': s}, {'$group': {'_id': None, 'total': {'$sum': "$properties.Count"} }} ]))[0]['total']
            except IndexError:
                count = 0
            except Exception as e:
                log.error(log.exc(e))
                count = 0
            results.append(count)
    except Exception as e:
        return self.error(log.exc(e))
    total = returned = len(results)       
    if 'properties.SpeciesName' in search:
        del search['properties.SpeciesName']
    return results, total, returned
