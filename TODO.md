- iNat photo issues + need NatGeo project membership
- ambits
- crons
- twitters
- taxonomy


- move to resolution
- audio -- pull created time from file

### new
- add SensorType (FeatureSubType) to SMS sensors
- WordPress RSS -- handles just like tweets
- resolution should be in the response metadata
- add totals to species counts

### server
- http auth -- make github private
- set up crons on server

### improvements
- verify_t should be smarter
- async for soundcloud and twilio
- resolution filter
- dont keep querying non-ambit wearers
- geo_estimation broken for non-ambit wearers who arent core


### geo estimating
- if the data has a Member, it's the ambit_geo of that Member, or anything else tagged, or finally the core beacon
- if the data doesnt, it's just the core beacon
- sensor sources not on the expedition will all have accompanying geodata, wont get mixed up
- same with John's data?


### thoughts
- api view caching, especially with processing
- currently no protection on duplicates -- unique second/type keys probably ok except for ambit

