### new / okavango_16

- all server updates and upgrades
- triggered rather than cron'ed ingest -- ie, use beanstalk like you should have
- ambit is the only thing via email now. can we eliminate that for consistency?
- update mongo / fix altitude issue
- retro-fix core->team, purge core stuff, including from config
- get rid of explicit members in the config, but include admin to fix/delete names
- team deletion / reassignment

the api itself is pretty ok. ingest 

ambit assignments need to be in an interface.
basically, we're making a backend.


### server
- make github private?

### improvements
- caching
- async for soundcloud and twilio
- geo_estimation broken for non-ambit wearers who arent core
- purging ambits