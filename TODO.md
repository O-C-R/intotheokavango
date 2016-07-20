### new / okavango_16

audio uploader is currently half-done

Interface:
- rebuild uploader (with Eric) -- sightings with photo attachment
- temporal scaling (experimental)

Server:
- triggered rather than cron'ed ingest -- ie, use beanstalk like you should have

processors -> crons
processors are now beanstalk triggered: inaturalist, audio, twilio?



### issues
- things that arent members or teams and wont be geotagged:
    intotheokavango twitter


### needed improvements
- async for soundcloud and twilio


### GBIF
http://www.gbif.org/developer/summary