- verify snapshots are happening on schedule

### new
- add SensorType (FeatureSubType) to SMS sensors
- WordPress RSS -- handles just like tweets
- resolution should be in the response metadata
- add totals to species counts
- okavango 13

### bugs
- access control issues on errors

### server
- http auth
- set up crons on server

### security
- this needs to happen now

### improvments
- verify_t should be smarter
- async for soundcloud and twilio
- resolution filter
- don't keep querying for ambits if their arent


### geo estimating
- if the data has a Member, it's the ambit_geo of that Member
- if the data doesnt, it's a beacon estimation from the core beacon
- sensor sources not on the expedition will all have accompanying geodata, wont get mixed up
- same with John's data


### thoughts
- send this shit to Ari and co
- need a backup strategy, ebs snapshots
- move everything to /mnt/data?
- api view caching, especially with processing
- currently no protection on duplicates -- unique second/type keys probably ok except for ambit

### remember
- will have to clear out and re-migrate old with altitude once Mongo updates to 3.1.0 (hopefully soon!)



### conceptual
- ingest defines anything that needs to be parsed differently, a loose correlation to FeatureTypes
- ingest might end up producing multiple features, via ingest_request, ingest_data
- whether ingest always happens through http or not is somewhat compromised


##### backup

https://aws.amazon.com/cli/

pip install awscli


