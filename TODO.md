### need
- filename format for audio / images

### now
- set up crons on server
- resolution filter
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