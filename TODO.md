### new / okavango_16

- get rid of explicit members in the config, but include admin to fix/delete names
- team deletion / reassignment
- ambit assignments need to be in an interface.


Search upgrades:
- polygon search
- "nots"
- comma-delineated multiple-options for queries

Data munging:
- great Egret error? on Slack
- missing geometry: http://intotheokavango.org/api/features?FeatureType=sighting&member=Paul

Interface:
- rebuild uploader (with Eric) -- sightings with photo attachment
- temporal scaling (experimental)

Server:
- triggered rather than cron'ed ingest -- ie, use beanstalk like you should have


### issues
- things that arent members or teams and wont be geotagged:
    intotheokavango twitter, 





### improvements
- caching
- async for soundcloud and twilio
- geo_estimation broken for non-ambit wearers who arent core
- purging ambits