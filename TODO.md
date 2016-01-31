### new / okavango_16

triggered rather than cron'ed ingest -- ie, use beanstalk like you should have
ambit is the only thing via email now. can we eliminate that?
update mongo / fix altitude issue
retro-fix core->team, purge core stuff, including from config

get rid of explicit members in the config, but include admin to fix/delete names

all server updates and upgrades

right now:
- users are created implicitly through content creation. should allow explicit creation.
- need team deletion / reassignment


### server
- make github private?

### improvements
- caching
- async for soundcloud and twilio
- geo_estimation broken for non-ambit wearers who arent core
- purging ambits