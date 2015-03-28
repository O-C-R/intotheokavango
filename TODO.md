### now
- cron 'processors', like heartrater, geo-assigner...
- cron ingestors, including email_relay, but also twitter... group all these into a module with error handling, one cron
- twilio hydrosensors
- resolution filter
- ExpeditionDay parameter
- given a time stamp find a geo -- (two pass? beacons come first, ambit data later) -- geoassigner process

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