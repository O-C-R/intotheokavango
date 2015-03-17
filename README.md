### Notes for front end


#### Adding static pages
Simply add a template with the desired page name. eg, `/example` will automatically point to `example.html` 
note that all templates should inherit from page.html.


#### Adding a new feature endpoint
Add a python module in the ingest folder with the name of the endpoint. eg, `/ingest/rhino` will load the module `rhino.py`. The module should contain a single function, `ingest(request)` which receives request variables and which returns a flat dictionary with feature attributes.

- `expedition`, `t_created`, and `kind` are added automatically.
- coordinates are automatically formated, so maybe be specified in individual fields

The generic endpoint `/ingest` can always be used if a `kind` attribute is given in the data


conventions:
- t_utc is a unix timestamp in UTC

