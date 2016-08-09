import geojson
from housepy import config, log, util

""" list of days, with total counts across sightings for each one """

def assemble(self, search, limit, order, resolution):
    log.info("sightings.assemble")
    try:
        results = {}
        if 'properties.t_utc' not in search:
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
            results[util.datestring(interval, tz=config['local_tz'])] = count
    except Exception as e:
        return self.error(log.exc(e))
    total = returned = len(results)       
    if 'properties.SpeciesName' in search:
        del search['properties.SpeciesName']
    return results, total, returned
