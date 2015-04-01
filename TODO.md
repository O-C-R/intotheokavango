### now
- resolution filter
- given a timestamp find a geo -- (two pass? beacons come first, ambit data later) -- geoassigner process
- cron 'processors', like heartrater, geo-assigner...
- twilio hydrosensors

### thoughts
- might want to run everything off of /mnt/data considering static files (or use a hardlink?)
- api view caching, especially with processing
- currently no protection on duplicates -- unique second/type keys probably ok except for ambit

### remember
- will have to re-migrate with altitude

#### injestion
- json file attachments, or images or sounds
    - soundcloud? API
- twitter




Resolution

supports:
- all
- hourly
- daily

does this make sense for all data? it's really just for position and heartrate, and it should be averaged