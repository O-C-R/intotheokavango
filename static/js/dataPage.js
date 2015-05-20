

/*
	API Explorer, Genevieve's turf.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html
	UI Built out with Ractive.js: http://www.ractivejs.org/
*/


function DataPage(id){
console.warn('DATA PAGE', id);
    var ractive, page;
	/* 	Extends Page in layout.js
		Which among others gives you access to the following methods:
		- page.getNode()
		- page.show()
		- page.hide()	*/
    page = Page(id);
    page._show = page.show.bind(page);
    page._hide = page.hide.bind(page);
    
    page.show = show;
    page.hide = hide;

    function show(){
        console.warn('WE ARE SHOWING');
        page._show();
    }

    function hide(){
        console.warn('WE ARE HIDING');
        page._hide();
    }



	///////////////////
    // DATA & VARS
    ///////////////////
    var sections = {
            'documentation': { nav_title: 'Documentation' , view_title: 'API Documentation', pageActive: false, content: "This is where we have information about the API" },
            'overview': { nav_title: 'Overview' , view_title: 'API Overview', pageActive: true, content: "This is where we embed a few interesting endpoint visualizations" },
            'explorer': { nav_title: 'Explorer' , view_title: 'API Explorer', pageActive: false, content: "This is where we have UI elements to explore the API" },
    };

    var index = 0;
    var featuresCountArray = [];
    var speciesList = [];
    
    //get features totals
    //get the totals for all features, recursively draw?
    var featureTotals = window.FEATURES_DATA;
    var features = ["ambit", "ambit_geo", "audio", "beacon", "blog", "image", "sensor", 'sighting', 'tweet'];
    var featureTitles = ["Ambit Readings", "Ambit-Geo Readings", "Audio Recordings", "Beacon Readings", "Blog Entries", "Images", "Sensor Readings", "Sightings", "Tweets"];
    
    //how to update query string based on text input
    var queryString = "";
    var viewString = "";
    var apiUrl = "http://intotheokavango.org/api/";
    ///////////////////

    /*
    #####################
    ### Tag Component ###
    #####################
    */

    (function(Template){
        var Tag = Template.extend({
            isolated: true,
            template: '#tagTemplate',
            data: function() {
                return {
                    message: 'No message specified, using the default',
                    queryTag: '',
                    queryTags: [] //try to pass in as an argument on initializiation 
                };
            }
        });

        Template.components.Tag = Tag;
    })(Ractive);


    /*
    ################################
    ### RactiveDropdownComponent ###
    ################################
    */
    (function(Template){
        var RactiveDropdownComponent = Template.extend({

            isolated: false,

            template: '#RactiveDropdownComponentTemplate',

            // configuration
            data: function() {
                return {
                    selectorClass: 'ractive-dropdown',
                    keycode: null,
                    selectedIndex: -1,
                    isOpened: false,
                    liHeight: 40,
                    padding: 20,
                    show: 2,
                    limit: 100,
                    selector: 'Nothing',
                    selectedText: 'Select from dropdown',
                    items2: ['apples', 'oranges', 'nada'],
                    items: [] // should be passed as an argument on object initialization
                };
            },

            // the onrender function will be called as soon as the instance has finished rendering
            oninit: function() {

                var self = this;

                var defaultText = self.get('selectedText');

                self.observe('items', function() {
                    self.set('selectedText', defaultText);
                });

                // save the items in a object variable
                self.items = self.get('items');

                self.selector = self.get('selector');

                // set the active item
                self.setActiveItem = function(index) {

                    // set the explicit index if it has been passed
                    if (typeof(index) != 'undefined') {
                        self.set('selectedIndex', index);
                    }

                    var currentIndex = self.get('selectedIndex');
                    var items = self.get('items');
                    var defaultText = self.get('selectedText');

                    if (currentIndex > -1 && currentIndex <= items.length) {
                        self.set({
                            selectedIndex: currentIndex,
                            selectedText: items[currentIndex]
                        });
                    } else {
                        self.set('selectedText', defaultText);
                    }

                };

                // open/close the dropdown
                self.toggleDropdown = function() {
                    self.toggle('isOpened');
                };

                // tagging the toggling
                self.on('toggleDropdown', function() {
                    self.toggleDropdown();
                });

                // event to select the item
                self.on('selectItem', function(event, index) {

                    self.setActiveItem(index);

                    self.toggleDropdown();

                    var items = self.get('items');

                    // fire a onSelect event to the ractive object where the component is being used
                    // pass the selected item
                    self.fire('onSelect', items[self.get('selectedIndex')], self.selector);

                });

                // move up/down through the list using the arrow keys
                self.on('move', function(event, direction) {

                    var currentIndex = self.get('selectedIndex'),
                        items = self.get('items');

                    if (direction == 'down') {
                        if (currentIndex < items.length - 1) {
                            self.set('selectedIndex', currentIndex + 1);

                            // scroll the list upwards
                            this.ul.scrollTop = this.ul.scrollTop + this.liHeight;
                        }
                    } else if (direction == 'up') {
                        if (currentIndex > 0) {
                            self.set('selectedIndex', currentIndex - 1);

                            // scroll the list downwards
                            this.ul.scrollTop = this.ul.scrollTop - this.liHeight;
                        }
                    }

                    self.setActiveItem();

                });
            },

            oncomplete: function() {

                var self = this;

                // calculate item height
                self.resizeList = function() {

                    var visibleElements = self.get('show'),
                        selectorClass = self.get('selectorClass'),
                        ul = self.find('.' + selectorClass + ' ul'),
                        li = self.find('.' + selectorClass + ' ul li'),
                        ulHeight,
                        liHeight;

                    // get the height of the li
                    ul.style.display = 'block';
                    ul.style.visibility = 'hidden';
                    liHeight = li.offsetHeight;
                    ulHeight = ul.offsetHeight;
                    ul.style.height = ulHeight - liHeight * visibleElements;
                    ul.style.display = 'none';
                    ul.style.visibility = 'visible';


                    // save them in object variables to make them accessible for external usage
                    self.liHeight = liHeight;
                    self.ulHeight = ulHeight;
                    self.ul = ul;

                    self.set('liHeight', liHeight);
                };
                self.observe('selectedText', function(newValue, oldValue, keypath) {
                    //console.info('new value:', newValue);
                    //console.info('key path:', keypath);
                });

                self.observe('show', function(newValue, oldValue, event) {
                    console.info('new value:', newValue);
                    console.info('ul', self.ul);
                });

            }

        });
        
        Template.components.RactiveDropdownComponent = RactiveDropdownComponent;
    })(Ractive);

    /*
    ################################
    ### QueryComponent ###
    ################################
    */
    (function(Template){
        var QueryComponent = Template.extend({
            el: "#query-area",
            template: "#query-template",
            // components: {
            //     RactiveDropdownComponent: RactiveDropdownComponent,
            //     Tag: Tag
            // },

            oninit: function() {
                var self = this;

                self.observe('*', this.parseQuery.bind(this));

                self.set('dropDownDisplay', 'none');
                self.set('dropDownGrandchild', 'none');

                self.on('RactiveDropdownComponent.onSelect', function(item, selector) {



                    self.set('selectedItem', item);
                    console.info('callback fired!', selector, item);
                    //console.log('queryTag: ' + this.get('queryTag'));

                    switch (selector) {
                        case "items":
                            var items2 = self.get('itemsKeys.' + item);
                            self.set('categoriesItems', items2);

                            self.set('dropDownDisplay', 'visible');
                            self.set('dropDownGrandchild', 'none');
                            // $("#dropdown-grandchild").hide();

                            this.set('queryObj.filter', item);
                            //Not updating tags on top filter - uncomment if you want to
                            // this.set('queryTag', queryObj["filter"]);
                            // console.log("query filter: " + this.get('queryTag')); 
                            break

                        case "categories":
                            var items2 = self.get('categoriesKeys.' + item);
                            //console.log("items2: " + items2);
                            self.set('modelsItems', items2);
                            //console.log('modelsItems: ' + self.get('modelsItems'));

                            //trying to update label, not working yet
                            //console.log("selectedText: " + self.get('selectedText'));
                            var state = 'none';
                            if (items2 && items2.length > 1) state = 'visible';

                            self.set('dropDownGrandchild', state);

                            if (this.get('queryObj.filter') === 'expeditions') {
                                this.set('queryObj.expedition', 'Expedition=' + item);

                            } else if (this.get('queryObj.filter') === 'members') {
                                this.set('queryObj.member', 'Member=' + item);

                            } else if (this.get('queryObj.filter') === 'features') {
                                this.set('queryObj.featureType', 'FeatureType=' + item);

                                console.log('QUERY SENSORTYPE: ' + this.get('queryObj.sensor'));
                                console.log('QUERY IMAGETYPE: ' + this.get('queryObj.image'));
                                console.log('QUERY SPECIES: ' + this.get('queryObj.species'));
                            }

                            break

                        case "models":
                            //console.log('in models');
                            //console.log(queryObj);
                            if (this.get('queryObj.featureType') === 'FeatureType=image') {
                                this.set('queryObj.image', 'ImageType=' + item);

                            } else if (this.get('queryObj.featureType') === 'FeatureType=sensor') {
                                this.set('queryObj.sensor', 'SensorName=' + item);

                            } else if (this.get('queryObj.featureType') === 'FeatureType=sighting') {

                                if (item.indexOf(' ') > -1) {
                                    //TODO: get rid of space?? - not here in parser?
                                }
                                this.set('queryObj.species', 'SpeciesName=' + item); //TODO: change to SpeciesName for OK15
                            }
                            break
                    }
                });
                ///
                //send new query on button press
                this.on({
                    runQuery: function() {
                        console.log(this.get('renderedURL'));
                        window.open(this.get('renderedURL'), '_blank');
                    }
                });

                this.on({
                    heartRateQuery: function() {
                        this.set('queryObj.filter', 'features');
                        this.set('queryObj.featureType', 'FeatureType=ambit');
                        this.set('queryObj.output', 'output=viz');
                        this.set('mapChecked', false);
                        this.set('vizChecked', true);
                        this.set('jsonChecked', false);
                        
                        var updatedUrl = "http://intotheokavango.org/api/features/viz";
                            //this.set('queryObj.output', "features/" + newValue);
                        this.set('apiUrl', updatedUrl);

                    }
                });

                this.on({
                    hippoSighting: function() {
                        this.set('queryObj.filter', 'features');
                        this.set('queryObj.featureType', 'FeatureType=sighting');
                        this.set('queryObj.species', 'SpeciesName=Hippo');
                        this.set('queryObj.output', 'output=map');
                        this.set('mapChecked', true);
                        this.set('vizChecked', false);
                        this.set('jsonChecked', false);
                        var updatedUrl = "http://intotheokavango.org/api/features/map";
                        this.set('apiUrl', updatedUrl);
                    }
                })

                this.observe('output', function(newValue, oldValue) {
                    //console.log('output: ' + newValue);
                    if (newValue != undefined) {
                        this.set('queryObj.output', 'output=' + newValue);
                    }

                    //TODO: take output/url parsing out of output, so that if you delete tag, the URL updates too
                    //console.log('output: ' + newValue);
                    var updatedUrl = '';
                    if (newValue === 'map' || newValue === 'viz') {
                        updatedUrl = "http://intotheokavango.org/api/features/" + newValue;
                        //this.set('queryObj.output', "features/" + newValue);
                    } else {
                        updatedUrl = "http://intotheokavango.org/api/features/";
                    }
                    //console.log(updatedUrl);
                    this.set('apiUrl', updatedUrl);
                });

                this.observe('limit', function(newValue, oldValue) {
                    //console.log('limit newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.limit', 'limit=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('order', function(newValue, oldValue) {
                    //console.log('order: ' + newValue);
                    if (newValue != undefined) {
                        var val;
                        if (newValue === 'ascending') {
                            val = 1;
                        } else {
                            val = -1;
                        }
                        this.set('queryObj.order', 'order=' + val);
                        //this.set('query', this.get('queryTag')); 
                    }
                });

                this.observe('expeditionDay', function(newValue, oldValue) {
                    console.log('expeditionDay newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.expeditionDay', 'expeditionDay=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('startDate', function(newValue, oldValue) {
                    console.log('startDate newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.startDate', 'startDate=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('endDate', function(newValue, oldValue) {
                    console.log('endDate newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.endDate', 'endDate=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('queryTags.length', function(n, o, k) {
                    console.log('array length', k, 'changed from', o, 'to', n);

                    if (n === 0) {
                        console.log("array is empty, so reset apiUrl");
                        this.set('apiUrl', "http://intotheokavango.org/api/features/");
                        this.set('dropDownDisplay', 'none');
                        this.set('dropDownGrandchild', 'none');
                    }
                });

                this.observe('queryTags.*', function(newValue, oldValue, event) {
                    console.log(this.get('queryTags'));
                    console.log('queryTags newValue: ' + newValue + ', oldValue: ' + oldValue);

                });

                this.observe('queryObj.*', function(newValue, oldValue, keypath) {
                    console.log('object key', keypath, 'changed from', oldValue, 'to', newValue);

                    var tagArrayLength = this.get('queryTags.length');

                    if (newValue) { //if the value is not undefined or an empty string

                        var splitNew = newValue.split('=');

                        switch (keypath) {
                            case 'queryObj.limit':
                                //iterate through array, either splice or push new limit

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.order':
                                //iterate through array, either splice or push new order

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.output':
                                //iterate through array, either splice or push new output

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.startDate':

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.endDate':

                            if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.expeditionDay':

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.filter':

                                //don't add tag for first dropdown filter

                                break

                            case 'queryObj.expedition':

                                //iterate through array, either splice or push new expedition

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.member':
                                //iterate through array, either splice or push new member
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.featureType':

                                //iterate through array, either splice or push new featureType
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    //this.addElement(tagArrayLength, splitNew[0], newValue);

                                    console.log("ARRAY HAS ELEMENTS");
                                    //splice if old and new are the same
                                    for (var i = 0; i < tagArrayLength; i++) {
                                        var item = this.get('queryTags[' + i + ']');
                                        console.log("ITEM: " + item);

                                        //if array item is a FeatureType
                                        if (item.indexOf(splitNew[0]) > -1) {

                                            //before you splice remove the other element???
                                            for (var j = 0; j < tagArrayLength; j++) {
                                                var item2 = this.get('queryTags[' + j + ']');
                                                console.log("ITEM2: " + item2);

                                                if (item2 != undefined) {
                                                    if (item2.indexOf('SpeciesName') > -1 || item2.indexOf('SensorType') > -1 || item2.indexOf('ImageType') > -1) {
                                                        console.log('item: ' + item2 + ' is a subcategory');
                                                        this.splice('queryTags', j, 1);
                                                        console.log('STATE OF THE ARRAY: ' + this.get('queryTags'));
                                                        var arrayState = this.get('queryTags');
                                                        //this.set('queryTags', arrayState);
                                                    }
                                                }

                                            }

                                            console.log("SPLICE THE NEW VALUE AT: " + item);
                                            this.splice('queryTags', i, 1, newValue);

                                            break
                                        }
                                        if (i === tagArrayLength - 1) { //only push it if checked against whole array
                                            console.log("PUSH " + newValue);
                                            this.push('queryTags', newValue);
                                        }
                                    }

                                    if (this.get('queryObj.sensor').indexOf('SensorName') > -1) {

                                    }
                                }

                                break

                            case 'queryObj.sensor':
                                //iterate through array, either splice or push new sensor
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.image':

                                //iterate through array, either splice or push new sensor
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.species':

                                //iterate through array, either splice or push new sensor
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break
                        }
                    }
                });
                ///
            },
            addElement: function (arrayLength, splitValue, newVal) {
                console.log("ARRAY HAS ELEMENTS");
                //splice if old and new are the same
                for (var i = 0; i < arrayLength; i++) {
                    var item = this.get('queryTags[' + i + ']');
                    console.log("ITEM: " + item);

                    if (item.indexOf(splitValue) > -1) {
                        console.log("SPLICE THE NEW VALUE AT: " + item);
                        this.splice('queryTags', i, 1, newVal);
                        return
                    }
                    if (i === arrayLength - 1) { //only push it if checked against whole array
                        console.log("PUSH " + newVal);
                        this.push('queryTags', newVal);
                    }
                }
            },
            parseQuery: function() {
                var serializeTags = function(obj) {
                    if (!obj) return ''; //reset URL here? to account for deleting output?
                    var str = [];
                    for (var p in obj)
                        if (obj.hasOwnProperty(p)) {
                            //console.log('serialize obj[p]: '+ obj[p]);
                            if (obj[p].indexOf('output') > -1) {
                                //console.log('dont add output to query as tag');
                            } else {
                                str.push(obj[p]);
                            }
                        }
                    if (!str.length) return '';
                    return '?' + str.join("&");
                };
                var url = this.get('apiUrl');
                var path = this.get('query');
                var query = serializeTags(this.get('queryTags'));
                if (path) url += path;
                if (query) url += query;

                this.set('renderedURL', url);
                //console.log(this.get('queryTags.*'));
                //console.log(this.get('queryTags.length'));
            },
            data: function() {
                return {
                    apiUrl: "http://intotheokavango.org/api/features",
                    mapChecked: false,
                    vizChecked: false,
                    jsonChecked: true,
                    queryObj: {
                        filter: "",
                        featureType: "",
                        member: "",
                        expedition: "",
                        species: "",
                        image: "",
                        sensor: "",
                        output: "",
                        order: "",
                        limit: "",
                        startDate: "",
                        endDate: "",
                        expeditionDay: ""
                    },
                    queryTags: [],
                    items: ['expeditions', 'members', 'features'],
                    categoriesItems: [],
                    modelsItems: [],

                    itemsKeys: {
                        expeditions: ['okavango_13', 'okavango_14', 'okavango_15'],
                        members: ["Alex", "Asher", "Brian", "Chaps", "Chris", "GB", "Giles", "Gotz", "Greg", "James", "Jer", "John", "KG", "Maans", "Markymarl", "Shah", "Tom", "null"],
                        features: ["ambit", "ambit_geo", "audio", "beacon", "blog", "image", "sensor", 'sighting', 'tweet'],
                    },
                    categoriesKeys: {
                        ambit: [],
                        ambit_geo: [],
                        audio: [],
                        beacon: [],
                        blog:[],
                        image: ['documentary', 'habitat', 'specimen'],
                        sensor: ['databoat1', 'sensor2', 'databoat'],
                        sighting: speciesList,
                        
                        tweet: []
                    },
                    selectedItem: '',
                    show: 3,
                    limit: 100,
                    expeditionDay: 1
                }
            }
        });
        Template.components.QueryComponent = QueryComponent;
    })(Ractive);
    
    /*
    ################################
    ### D3Component ###
    ################################
    */
    (function(Template){
        var d3Page = d3Graph("#totalsViz", "#timelineViz");
        var D3View = Template.extend({
            template:"#d3-template",
            oninit:function(){
                // d3Graph("#d3-content")
                console.log("d3 ractive");
                d3Page.show();
                d3Page.loadData("/api/features/?FeatureType=sighting&SpeciesName=African Jacana&limit=40", "sighting");
            },
            onteardown:function(){
                d3Page.hide();
            }
        });

        Template.components.D3View = D3View;
    })(Ractive);


   /*
    ################################
    ### FeaturesComponent ###
    ################################
    */
    (function(Template){
        var FeaturesWidget = Template.extend({
            template:"#featuresTemplate",
            data: function() {
                return {
                    featuresArray: featureTotals
                };
            }
        });
        Template.components.FeaturesWidget = FeaturesWidget;
    })(Ractive);
    
    /*

    #############
    ### USAGE ###/*
    #############
    ### USAGE ###
    #############
    */

    //need this ractive to update data from server (won't go to widget)
    var ractive_features = new Ractive({
        el: "#features-totals",
        template: "#featuresTemplate",
        data: {
            featuresArray: featureTotals
        }
    });

    ////////////////////

    page.getSpeciesList = function() {
        d3.json("http://intotheokavango.org/api/species", function(error, data) {
            if(error) {
                console.error("Failed to load " + url);
                console.log(error);
                return error;
            } else {
                for (species in data.results) {
                    var count = data.results[species];
                    //console.log(species + ": " + count);
                    if(species.indexOf("quote") != -1 || species.indexOf("test") != -1 || species.indexOf("Test") != -1) {
                        console.log("not a species");
                    } else {
                        speciesList.push(species);
                    }
                }
                speciesList.sort();
                console.log(speciesList);
            }
        });
        return speciesList;
    }


	page.getFeatureTotalData = function(featureType) {
        var url = "http://intotheokavango.org/api/features?FeatureType=" + featureType + "";
        d3.json(url, function(error, data) {
            //console.log(featureType + " data");

            var featuresCountObj = {};
            featuresCountObj.featureType = featureType;
            featuresCountObj.total = data.total;
            featuresCountArray.push(featuresCountObj);

            // console.log("index: " + index);
            // console.log(ractive_features.get("featuresArray[" + index + "].total"));
            ractive_features.set("featuresArray[" + index + "].total", featuresCountObj.total);

            if (index < features.length - 1) {
                index++;
                setTimeout(page.getFeatureTotalData(features[index], 100));
            } else {
                // console.log("featuresCountArray");
                // console.log(featuresCountArray);
                // console.log("featuresArray at index: " + index);
                // console.log(ractive_features.get("featuresArray"));

                // totalsVizDiv.fadeIn();
                // makeTotalsViz(featuresCountArray);
            }
        });
	};

	page.loadRactive = function() {
		console.warn("loading ractive!!!");
		ractive = new Ractive({
	      	el: '#data-content',
	      	// We could pass in a string, but for the sake of convenience
	      	// we're passing the ID of the <script> tag above.
	      	// template: '#navTemplate',
	      	template: '#content-template',
            oninit:function(){
                console.warn('ON INIT')
                this.setActive('overview');
            },
            setActive: function(id){
                console.warn('ID', id);
                this.set('section', id);
                d3.select('#data-navigation li.documentation').classed('active', false);
                d3.select('#data-navigation li.overview').classed('active', false);
                d3.select('#data-navigation li.explorer').classed('active', false);
                
                var button = d3.select('#data-navigation li.' + id);
                button.classed('active', true);
                var activeSection = this.get('sections.'+id);
                this.set('activeSection', activeSection);
            },	     	
            // delimiters: [ '{[{', '}]}' ], //dont' need delimiters if using {% raw %} and {% endraw %}
	      	// Here, we're passing in some initial data
	      	data: { 
                'section': 'overview',
                'sections': {
                    'documentation': {  nav_title: 'Documentation' , view_title: 'API Documentation', pageActive: false, content: "This is where we have information about the API" },
                    'overview': {  nav_title: 'Overview' , view_title: 'API Overview', pageActive: true, content: "This is where we embed a few interesting endpoint visualizations" },
                    'explorer': {  nav_title: 'Explorer' , view_title: 'API Explorer', pageActive: false, content: "This is where we have UI elements to explore the API" },
                }
			}
		});
		
		window.ra = ractive;
	}



	page.loadRactive();
    page.getFeatureTotalData(features[index]);
    page.getSpeciesList();
    
    
    // var D3View = Ractive.extend({
    //     el:'#d3-content',
    //     template:"#d3-template",
    //     oninit:function(){
    //         // d3Graph("#d3-content")
    //         console.log("d3 ractive");
    //         d3Page.show();
    //         d3Page.loadData("api/features/?FeatureType=ambit", "ambit");
    //     },
    //     onteardown:function(){
    //         d3Page.hide();
    //     }
    // });
    //console.log(Object.keys(d3Page));
    
	return page;
}

