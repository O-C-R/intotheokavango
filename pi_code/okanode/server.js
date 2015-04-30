/*

Okavango RaspPi Server, v.0.1
jer@o-c-r.org
henry@o-c-r.org

August, 2014

--> Handles file uploads from the Android App
--> Queues uploads to the intotheokavango server
--> Manages connection to Iridium network on Iridium GO!

*/

var express    	= require('express');
var winston    	= require('winston');
var multer 		= require('multer');
var bodyparser 	= require('body-parser');
var fs 			= require('fs');
var request 	= require('request');
var exec        = require('child_process').exec;
var execFile    = require('child_process').execFile;
var gm          = require('gm').subClass({imageMagick: true});
var Twit        = require('twit');
var rest        = require('restler');
var colors      = require('colors');

var portNum = 3000;

var reporting = true;
var upCount = -1;
var upFreq = 5 * 60 * 1000;

var picInterval = 10 * 60 * 1000; 
var upTweet = false;

var mothership = "http://intotheokavango.org/"
//var mothership = "http://granu.local:7777/";

//Make the Express app
var app = express();
app.use(bodyparser());
app.use('/', express.static(__dirname + '/public'));
app.use(multer({ dest: './uploads/'}))

var filePath = "./public/uploads/"
var archivePath = "./public/archive/"

var upDate = new Date();

var totalIn = 0;
var totalOut = 0;

var totalsIn = [];
totalsIn['jpg'] = 0
totalsIn['json'] = 0
totalsIn['mp3'] = 0

var totalsOut = [];
totalsOut['jpg'] = 0
totalsOut['json'] = 0
totalsOut['mp3'] = 0

var connectedW1 = false;
var connectedB1 = false;
var connectedB2 = false;

// connect to iridium network
var checking_connection = false;
var active_connection   = false;
var sending             = false;

//logging
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ name: 'file#info', filename: 'server.log', level: 'info' }),
      new (winston.transports.File)({ name: 'file#error', filename: 'error.log', level: 'error' })
    ]
});




//Reporter
doReport = function() {
    upCount ++;
    var upTime = (upCount * upFreq) / 1000;
    logger.info("UPTIME: " + upTime + "s")
    if (upTweet) {

        //okavangodata
        var T = new Twit({
            consumer_key:         'xRD73Yr33ANdPHa8FsEcuYTA7'
          , consumer_secret:      'Rev8bH510Z0zmrUpeNtKiZCFvtAKyol4ptb03dKZWGP1Pi9ZX4'
          , access_token:         '2696222534-TxkCApfwE407fKJaJ1bQYxgyUCBXM6jZLqEqKEo'
          , access_token_secret:  '6EQKdSUD6IR0WKbD0O2U80k8b8IDfrNiZvroKJJIpXOSF'
        })

        //
        T.post('statuses/update', { status: 'RaspPi File Server has been up for ' + upTime + ' seconds.' }, function(err, data, response) {
          logger.info(data);
        })

    }
}

//GoPro Stuff
app.get('/takePic', function(req, res){
   exec('/home/pi/okavango/gopro/./download_master.sh', function(error, stdout, stderr) {
       res.json({output: stdout, error: stderr});
   });
});

app.get('/resetNetwork', function(req, res){
   exec('sudo /home/pi/okavango/gopro/./setRoutes.sh', function(error, stdout, stderr) {
       res.json({output: stdout, error: stderr});
       if (stderr == ""){
         logger.info("Restarted network");
       } else {
         logger.error("Error restarting network: " + stderr);
       }
   });
});

takePic = function(){
    exec('/home/pi/okavango/gopro/./download_master.sh', function(error, stdout, stderr) {
       if (stderr != ""){
        logger.error("Error taking pics: " + stderr);
        logger.error("Error taking pics: " + stderr);
       } else {
        logger.info("Pictures taken");
       }
    });
}

testConnect = function(callback){
  exec('ping -I wlan1 -c 2 10.5.5.9', function(error, stdout, stderr) {
    if (error != null){
        logger.error("Can't connect to w1");
        connectedW1 = false;
    } else {
        logger.error("Connected to w1");
        connectedW1 = true;
    }
    exec('ping -I wlan2 -c 2 wlan1 10.5.5.10', function(error, stdout, stderr) {
      if (error != null){
        logger.error("Can't connect to b2");
        connectedB2 = false;
      } else {
        logger.error("Connected to b2")
        connectedB2 = true;
      }
      exec('ping -I wlan3 -c 2 10.5.5.8', function(error, stdout, stderr) {
      if (error != null){
        logger.error("Can't connect to b1");
        connectedB1 = false;
      } else {
        logger.info("Connected to b1");
        connectedB1 = true;
      }
      callback();
     });
    });
  });
}

resetNetwork = function(){
    exec('sudo /home/pi/okavango/gopro/./setRoutes.sh', function(error, stdout, stderr) {
       if (stderr == ""){
         logger.info("Restarted network");
       } else {
         logger.error("Error restarting network: " + stderr);
       }
   });
}

//Queue & File Upload
doQueue = function() {

    if (!sending) {
    	var jsonList = fs.readdirSync(filePath + "json");
    	var goproList = fs.readdirSync(filePath + "jpg/gopro");
        var goProLeftList = fs.readdirSync(filePath + "jpg/left");
        var goProCenterList = fs.readdirSync(filePath + "jpg/center");
        var goProRightList = fs.readdirSync(filePath + "jpg/right");
    	var mp3List = fs.readdirSync(filePath + "mp3");
        var tweetList = fs.readdirSync(filePath + "tweet");
        var chk = false;
    	//Are there JSON files to upload?
    	if (jsonList.length > 0) {
    		for (var i = 0; i < jsonList.length; i++) {
    			if (jsonList[i].indexOf('json') != '-1') {
    				logger.log('info', "Found JSON to upload.");
    				attemptUploadJSON(filePath + "json/" + jsonList[i]);
                    chk = true;
    				break;
    			}	
    		}
        }
        if (tweetList.length > 0 && !chk) {
            //If not, try tweets
            for (var i = 0; i < tweetList.length; i++) {
                if (tweetList[i].indexOf('json') != '-1') {
                    console.log('Found tweet to upload');
                    fs.readFile(filePath + "tweet/" + tweetList[i], 'utf8', function(err, data) {
                        if (err) {
                            console.log('problem with tweet');
                            return;
                        } else {
                            data = JSON.parse(data);
                            console.log("ATTEMPT TWEET RELAY.")
                            var r = request.post('http://localhost:3000/tweet', function(err, res, body) {
                                    if (err) {
                                        return console.error('tweet failed:' , err);
                                    } else {
                                        archive(filePath + "tweet/" + tweetList[i]);
                                    }
                            });

                            var form = r.form();
                            form.append('account', data.account);
                            form.append('Tweet', data.Tweet);
                        }
                    });

                    chk = true;
                    break;
                }
            }
        }
        if (goproList.length > 0 && !chk) {

            for (var i = 0; i < goproList.length; i++) {
                if (goproList[i].indexOf('jpg') != '-1') {
                    logger.log('info', "Found JPG to upload.");

                    var url = "gopro/" + goproList[i];

                    var outputFilename = './public/uploads/json/gopro_' + goproList[i] + '.json';

                    var obj = {
                        TeamMember:"null",
                        ImageType:"GoPro",
                        ResourceURL:url

                    }

                    fs.writeFile(outputFilename, JSON.stringify(obj, null, 4), function(err) {
                        if(err) {
                          logger.error(err);
                          //res.send('Did not get it. :(')
                        } else {
                          logger.info("JSON saved to " + outputFilename);
                          //res.send('Got it!')
                        }
                    }); 

                    // *** NEED TO RESIZE 
                    // resizeAndUpload(filePath + "jpg/" , imageList[i]);
                    //attemptUploadImage(filePath + "jpg/left/" + imageList[i], "NULL", "left", "NULL");
                    chk = true;
                    break;
                }   
            }



            
        }
        if (goProLeftList.length > 0 && !chk) {
            //If not, try an image
            for (var i = 0; i < goProLeftList.length; i++) {
                if (goProLeftList[i].indexOf('jpg') != '-1') {
                    logger.log('info', "Found JPG to upload.");

                    // *** NEED TO RESIZE 
                    // resizeAndUpload(filePath + "jpg/" , imageList[i]);
                    attemptUploadImage(filePath + "jpg/left/" + imageList[i], "NULL", "left", "NULL");
                    chk = true;
                    break;
                }   
            }
        }
        if (goProCenterList.length > 0 && !chk) {
            //If not, try an image
            for (var i = 0; i < goProCenterList.length; i++) {
                if (goProCenterList[i].indexOf('jpg') != '-1') {
                    logger.log('info', "Found JPG to upload.");

                    // *** NEED TO RESIZE 
                    // resizeAndUpload(filePath + "jpg/" , imageList[i]);
                    attemptUploadImage(filePath + "jpg/center/" + imageList[i], "NULL", "center", "NULL");
                    chk = true;
                    break;
                }   
            }
        }
        if (goProRightList.length > 0 && !chk) {
            //If not, try an image
            for (var i = 0; i < goProRightList.length; i++) {
                if (goProRightList[i].indexOf('jpg') != '-1') {
                    logger.log('info', "Found JPG to upload.");

                    // *** NEED TO RESIZE 
                    // resizeAndUpload(filePath + "jpg/" , imageList[i]);
                    attemptUploadImage(filePath + "jpg/right/" + imageList[i], "NULL", "right", "NULL");
                    chk = true;
                    break;
                }   
            }
        }
    	if (mp3List.length > 0 && !chk) {
    		//Or at last resort, a sound file!
    		for (var i = 0; i < mp3List.length; i++) {
    			if (mp3List[i].indexOf('mp3') != '-1') {
    				//console.log("Found mp3 to upload.");
    				attemptUploadSound(filePath + "mp3/" + mp3List[i]);
    				break;
    			}	
    		}
    	}
    }
	
}


checkConnection = function() {
    if (!checking_connection) {
        checking_connection = true;
        var stream = execFile('../okaridium.py', ['status']);
        stream.stdout.on('data', function(data) {
            if (data == 'You are not on the same network as the Iridium GO!\n') {
                // console.log('You are not on the same network as the Iridium GO!'.red);
                active_connection = true;
            } else {
                var strength = data.charAt(0);
                var conn_status = data.charAt(2);

                if (strength == '0') {
                    logger.info('Signal strength: ' + 'NO SIGNAL'.red);
                } else {
                    logger.info('Signal strength: ' + strength.green + ' / 5'.green);
                }
                var conn_string = '';
                switch (conn_status) {
                    case '0':
                        conn_string = 'INACTIVE'.red;
                        break;
                    case '1':
                        conn_string = 'CONNECTING'.yellow;
                        break;
                    case '2':
                        conn_string = 'NEGOTIATING'.yellow;
                        break;
                    case '3':
                        conn_string = 'AUTHENTICATED'.yellow;
                        break;
                    case '4':
                        conn_string = 'ACTIVE'.green;
                        break;
                    case '5':
                        conn_string = 'TERMINATING'.red;
                        break;
                    case '6':
                        conn_string = 'TERMINATED'.red;
                        break;
                }
                logger.info('Connection status: ' + conn_string);
                logger.info('');

                if (strength != '0') {
                    if (conn_status == '0') {
                        logger.info('Putting network connection ' + 'UP'.yellow + '...');
                        logger.info('');
                        execFile('../okaridium.py', ['data', 'up']);
                        active_connection = false;
                    } else if (conn_status == '4') {
                        active_connection = true;
                    } else {
                        active_connection = false;
                    }
                } else {
                    if (conn_status != '0') {
                        logger.info('Putting network connection ' + 'DOWN'.red + '...');
                        logger.info('');
                        execFile('../okaridium.py', ['data', 'down']);
                    }
                    active_connection = false;
                }
            }
            checking_connection = false;
        });
    }
}

var __dirPath;
var __fileName;
var __newName;
var toArchive = null;

resizeAndUpload = function(dirPath, fileName) {
    __dirPath = dirPath;
    __fileName = fileName;
    fileFront = fileName.split('.')[0];
    fileExt = fileName.split('.')[1];
    __newName = dirPath + fileFront + "_small." + fileExt;
    __newName = __newName.replace('uploads', 'temp')
    logger.info("filename: " + dirPath + fileName);
    sending= true;
    gm(dirPath + fileName).resize(50).write(__newName, function(err) {
        if (err) {
            logger.error(err);
        } else {
            attemptUpload(__newName);
            //This needs to only happen at the end.
            toArchive = __dirPath + __fileName;
            //archive(__dirPath + __fileName)
        }
    });
    
}

attemptUpload = function(filePath, endpoint) {
	console.log("Attempting an upload on " + filePath);
    sending = true;
    var r = request.post({'uri': mothership + 'upload', 'timeout': 120000}, function optionalCallback (err, httpResponse, body) {
        if (err) {
            sending = false;
            //Delete small file
            if (filePath.indexOf('small') != -1) fs.unlinkSync(filePath);
            return logger.error('upload failed:', err);
        } else {
            logger.info('Upload successful!  Server responded with:', body);
            archive(filePath)
            if(toArchive) archive(toArchive)
            toArchive = null;
            sending = false;
        }
	});

    var form = r.form();
    form.append('filearg', fs.createReadStream(filePath));
}

attemptUploadSensor = function(filePath) {
    console.log("Attempting an upload on " + filePath);
    sending = true;
    var r = request.post({'uri': mothership + 'ingest/sensor', 'timeout': 120000}, function optionalCallback (err, httpResponse, body) {
        if (err) {
            sending = false;
            //Delete small file
            fs.unlinkSync(filePath);
            return logger.error('upload failed:', err);
        } else {
            logger.info('Upload successful!  Server responded with:', body);
            archive(filePath)
            if(toArchive) archive(toArchive)
            toArchive = null;
            sending = false;
        }
    });
    var form = r.form();
    form.append('filearg', fs.createReadStream(filePath));
}

attemptUploadImage = function(filePath, memberName, cameraName, tags) {

    console.log("Attempting an image upload on " + filePath);
    sending = true;

    var json = JSON.parse(fs.readFileSync(filePath, "utf8"));

    request({
        method: 'POST',
        uri: mothership + 'ingest/image',
        //body: fs.createReadStream(filePath),
        
        attachments: [
            {
                'content-type': 'application/json',
                body: JSON.stringify(json)
            }
        ],
        
      },
      function (error, response, body) {
        if (error) {
          return console.error('Image upload failed:', error);
        } else {
            console.log('Image upload successful!  Server responded with:', body);
            archive(filePath);
        }
        sending = false;
      })


}

attemptUploadJSON = function(url) {
    console.log("Attempting a JSON upload on " + url);
    sending = true;

    var file = fs.createReadStream(url);
    var json = JSON.parse(fs.readFileSync(url, "utf8"));

    var ingestType = '';
    var ingestPath = 'jpg';

    var rPath = null;
    //Sighting
    console.log(json);
    if (json.Count != null) {
        ingestType = "sighting";
    } else if (json.ImageType != null) {
        ingestType = "image";
        ingestPath = "jpg";
    } else if (json.SoundType != null) {
        ingestType = "audio";
        ingestPath = "mp3"
    } else if (json.data != null) {
        ingestType = "databoat"
    }



    var r = request.post(mothership + 'ingest/' + ingestType, function optionalCallback(err, httpResponse, body) { 
        if (err) {
            sending = false;
            return logger.error('upload failed:', err);
        } else {
            logger.info('Upload successful!  Server responded with:', body);
            console.log("ARCHIVING " + url);
            archive(url);
            if (rPath) archive(rPath);
            sending = false;
        }
    });

    var form = r.form();
    form.append('json', fs.createReadStream(url));
    if (json.ResourceURL != null) {
        rPath = filePath + ingestPath + "/" + json.ResourceURL;
        console.log("ADDING RESOURCE:" + rPath);
        form.append('resource', fs.createReadStream(rPath));
        //
    }

}

attemptUploadSound = function(filePath) {
    /*
    console.log("Attempting an upload on " + filePath);
    var formData = {
        custom_file: {
            value:  fs.createReadStream(filePath),
            options: {
                memberName: "unknown",
                tags: "null"
            }
        }
    };
    sending = true;
    var r = request.post({'uri': mothership + 'ingest/sound', 'auth': {'user': username, 'pass': password}, formData: formData, 'timeout': 120000}, function optionalCallback (err, httpResponse, body) {
        if (err) {
            sending = false;
            //Delete small file
            fs.unlinkSync(filePath);
            return logger.error('upload failed:', err);
        } else {
            logger.info('Upload successful!  Server responded with:', body);
            archive(filePath)
            if(toArchive) archive(toArchive)
            toArchive = null;
            sending = false;
        }
    });
   */
}

archive = function(filePath) {

	today = new Date();
	var dt = today.format("ddmmyy");

	mkdirSync("./public/archive/" + dt);
	mkdirSync("./public/archive/" + dt + "/json");
	mkdirSync("./public/archive/" + dt + "/mp3");
	mkdirSync("./public/archive/" + dt + "/jpg");
    mkdirSync("./public/archive/" + dt + "/jpg/left");
    mkdirSync("./public/archive/" + dt + "/jpg/center");
    mkdirSync("./public/archive/" + dt + "/jpg/right");
    mkdirSync("./public/archive/" + dt + "/jpg/gopro");
	mkdirSync("./public/archive/" + dt + "/tweet");

	var archPath = filePath.replace('uploads', 'archive/' + dt);
	fs.renameSync(filePath, archPath );
	logger.info("Archived:" + archPath );

	totalOut ++;
}


var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path)
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

app.post('/tweetq', function(req, res) {
    logger.info(req.body)
    logger.info("QUEUE TWEET:" + req.body.Tweet)

    var outputFilename = './public/uploads/tweet/tweet_' + (new Date()).getTime() + '.json';

        fs.writeFile(outputFilename, JSON.stringify(req.body, null, 4), function(err) {
            if(err) {
              logger.error(err);
              res.send('Did not get it. :(')
            } else {
              logger.info("JSON saved to " + outputFilename);
              res.send('Got it!')
            }
        }); 


    res.send('Tweet queued for upload!');

});


//Very simple twitter posting
app.post('/tweet', function(req, res) {
    logger.info(req.body)
    logger.info("REQUESTED TWEET:" + req.body.Tweet);

    /*
    APP_KEY = "PDtNJXpCD1v6oqtelAA7JuGzq";
    APP_SECRET = "q4mBpZGKIDFEHzURtQpbCBuZyF3tyU0078oWfsYdq4HJ5VLPf6";
    OAUTH_TOKEN = "2690906527-6pdw88pGs2Vrbw4QXb8Y57l4LXfYRb3zUnInrAr";
    OAUTH_TOKEN_SECRET = "Qus7rdrsA0wD4AzJ46J6byeHKmNrPajhoVJMyaXVMG9CG";
    */

    var T;

    if (req.body.account == 'intotheokavango') {
        //intotheokavango
        var T = new Twit({
            consumer_key:         'PDtNJXpCD1v6oqtelAA7JuGzq'
          , consumer_secret:      'q4mBpZGKIDFEHzURtQpbCBuZyF3tyU0078oWfsYdq4HJ5VLPf6'
          , access_token:         '2690906527-6pdw88pGs2Vrbw4QXb8Y57l4LXfYRb3zUnInrAr'
          , access_token_secret:  'Qus7rdrsA0wD4AzJ46J6byeHKmNrPajhoVJMyaXVMG9CG'
        })
    } else if (req.body.account == 'blprnt') {

        //blprnt
        var T = new Twit({
            consumer_key:         'bwBhxu7975hcAmcecbX6DuY4r'
          , consumer_secret:      'RbcPLk1UmaMdVr9phhYj4QY7JVKimE72iW59D4E24Uxp1wOkyz'
          , access_token:         '17013577-cPFYlTFDQszOwWyQOMV1UeLFzy6lOvohZdAan7r0s'
          , access_token_secret:  'F0jCb54lfUu04WYxZLBaH4D8tGzvlER8vX9SSjgpxgnJA'
        })
    }
    console.log("PREPPING TWEET.")
    //
    T.post('statuses/update', { status: req.body.Tweet }, function(err, data, response) {
        if (err) {
            console.log("ERROR SENDING TWEET")
            console.log(err)
            //console.log(response)
        }
        else {
            res.send('SUCCESS! Tweet sent!');
    logger.info("TWEET SENT")
        }
      logger.info(data)
    })
    

});

app.get('/form', function(req, res){
    res.send("public/uploadForm.html")
});

//Handle file uploads
app.post('/upload', function(req, res) {
    // get the temporary location of the file
    logger.info("UPLOAD ATTEMPT.")
    if (req.files.file) {
        var tmp_path = req.files.file.path;
        logger.info(tmp_path);
        var ext = req.files.file.extension;

        var ds = dateFormat(new Date(), 'ddmmyyHHMMss')

        var tm = req.param('TeamMember', null)
        logger.info("TEAM MEMBER: " + tm)

        // *** NEED TO CHANGE DATE, RENAME .JPGs


        if (ext == 'jpg' || ext == 'mp3' || ext == 'json') {
        // set where the file should actually exists - this is dependant on the extension
        var target_path = './public/uploads/' + ext + "/" + tm + "_" + ds + "." + ext; 
        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.send('SUCCESS! File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
                totalIn ++;
                totalsIn[ext] ++;
            });
        });
        } else {
        	logger.info("Unsupported extension.")
        	res.send("FAIL. Unsupported extension.")
        }
    } else {
        //Just save JSON - upload to server will be handled by the queue

        if (!req.body.t_utc) {
            req.body.t_utc = Math.floor((new Date()).getTime() / 1000);
        }

        var outputFilename = './public/uploads/json/app_' + req.body.t_utc + '.json';

        fs.writeFile(outputFilename, JSON.stringify(req.body, null, 4), function(err) {
            if(err) {
              logger.error(err);
              res.send('Did not get it. :(')
            } else {
              logger.info("JSON saved to " + outputFilename);
              res.send('Got it!')
            }
        }); 


        console.log(req.body);
    }
});

//Status report!
app.get('/status', function(req, res){
  testConnect(function(){
     res.send('<html><head/><body><h1>Server is up.</h1><h3>Since:' + upDate + '</h3><h3>Total In:' + totalIn + '</h3><h3>Total Out:' + totalOut + '</h3><h3>Connected to B1 (left):' + connectedB1 + '</h3><h3>Connected to W1 (center):' + connectedW1 + '</h3><h3>Connected to B2 (right):' + connectedB2 + '</h3></body></html>');
  });
});

//---------------------- END OF USEFUL STUFF (REST IS DATE FORMATTING CODE) ------------------------

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

/*

//OLD STUFF
var express    = require('express');
var app        = express();
var winston    = require('winston');
var bodyparser = require('body-parser');

// log to a file, not the console
winston.add(winston.transports.File, { filename: 'server.log' });
winston.remove(winston.transports.Console);

// parse POST
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// route requests
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'welcome to the okavango delta' });   
});

router.route('/message')
    .post(function(req, res) {
        winston.log('info', req.body.message);
        res.json({ message: '10-4, message received' });
});

// all of our routes will be prefixed with /api
app.use('/api', router);

var port = process.env.PORT || portNum;
app.listen(port);
console.log("LISTENING ON " + portNum)

*/


    mkdirSync("./public/uploads/tweet");
    mkdirSync("./public/uploads/json");
    mkdirSync("./public/uploads/mp3");
    mkdirSync("./public/uploads/jpg");


//Set the server up to listen
var port = process.env.PORT || portNum;
app.listen(port);
logger.info("LISTENING ON " + portNum)

resetNetwork();

//Set up the interval for uploads
setInterval(doQueue, 1000);
setInterval(takePic, picInterval);
setInterval(doReport, upFreq);
// Set up interval to check connection status
setInterval(checkConnection, 1000);
doReport();

