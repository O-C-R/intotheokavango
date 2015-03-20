### Notes for front end


#### Adding static pages
Simply add a template with the desired page name. eg, `/example` will automatically point to `example.html` 
note that all templates should inherit from page.html.


#### Adding a new feature ingestion endpoint
Add a python module in the `ingest` folder with the name of the endpoint. eg, `/ingest/rhino` will load the module `rhino.py`. The module should contain a single function, `ingest(request)` which receives tornado request variables and which returns either GeoJSON or a flat dictionary with feature attributes.

- `expedition`, `t_created`, and `kind` are added automatically.
- coordinates are automatically formated, so they may be specified in individual fields
- `t_utc` must be provided - a UNIX timestamp in UTC

The generic endpoint `/ingest` can always be used if a `kind` attribute is given in the data


#### recent versions
This code relies on pymongo 3.0b, which has more concise collection queries  
mongo 3.1.0 supports altitude in the geojson fields (literally 6 days ago) -- current release version is 3.0.0  
so at the moment we are not supporting altitude, but upgrade that before launch  
