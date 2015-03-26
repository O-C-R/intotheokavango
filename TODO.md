### now
- BirdName -> species name
- currently no protection on duplicates -- unique second/type keys probably ok except for ambit
- begin ingestion modules
- resolution filter
- 'order' parameter "descending"
- ExpeditionDay parameter
- given a time stamp find a geo -- (two pass? beacons come first, ambit data later) -- geoassigner process

### thoughts
- might want to run everything off of /mnt/data considering static files (or use a hardlink?)
- folders for uploaded data and for live accessible media is different
- meta view caching

### questions
- files vs post body
- email vs api
- incoming as geojson or not
- mapbox is still pulling from me

### remember
- will have to re-migrate with altitude





#### injestion

- beacon is email, probably same (unknown)
- ambit data is email

- hydrosensors --- twilio

- json file attachments, or images or sounds
    - soundcloud? API

- twitter


#### processors

- heartrater