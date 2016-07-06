### new / okavango_16
- triggered rather than cron'ed ingest -- ie, use beanstalk like you should have
- ambit is the only thing via email now. can we eliminate that for consistency?
- retro-fix core->team, purge core stuff, including from config
- get rid of explicit members in the config, but include admin to fix/delete names
- team deletion / reassignment
- ambit assignments need to be in an interface.
- migrate altitude into the geojson point for old data
- missing geometry: http://intotheokavango.org/api/features?FeatureType=sighting&member=Paul
- comma-delineated multiple-options for queries
- "nots"
- polygon search


### issues
- are geo sources other than beacons generalizable?


### admin
- ambit is an assignable "geo-source"
- delete and reassign members



### server
- make github private?

### improvements
- caching
- async for soundcloud and twilio
- geo_estimation broken for non-ambit wearers who arent core
- purging ambits