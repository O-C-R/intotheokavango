### new / okavango_16

Search upgrades:
- polygon search
- "nots"
- comma-delineated multiple-options for queries

DB upgrades:
- migrate altitude into the geojson point for old data

Data munging:
- great Egret error? on Slack
- missing geometry: http://intotheokavango.org/api/features?FeatureType=sighting&member=Paul

Interface:
- rebuild uploader (with Eric) -- sightings with photo attachment
- temporal scaling (experimental)


- retro-fix core->team, purge core stuff, including from config
- triggered rather than cron'ed ingest -- ie, use beanstalk like you should have
- get rid of explicit members in the config, but include admin to fix/delete names
- team deletion / reassignment
- ambit assignments need to be in an interface.



### issues
- are geo sources other than beacons generalizable?


### admin
- ambit is an assignable "geo-source"
- delete and reassign members



### improvements
- caching
- async for soundcloud and twilio
- geo_estimation broken for non-ambit wearers who arent core
- purging ambits