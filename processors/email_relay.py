#!/usr/bin/env python3

import geojson, csv, dateutil, datetime, time, os, zipfile, pytz, xmltodict, json, shutil, urllib, math, subprocess
from housepy import config, log, util, strings, emailer, net

def main():    
    log.info("Checking email...")
    messages = emailer.fetch()
    log.info("--> found %s new messages" % len(messages))
    for m, message in enumerate(messages):
        log.info("Processing message %s..." % m)
        if message['from'] not in config['allowed_senders']:
            log.warning("Received bunk email from %s" % message['from'])
            continue
        subject = message['subject'].lower().strip()
        log.info("--> subject: %s" % subject)
        def check_satellites(subject):
            for satellite in config['satellites']:
                if satellite.lower() in subject:            
                    return True
            return False
        if check_satellites(subject):
            # relay a beacon (body post)
            url = "%s/ingest/beacon" % config['url']
            log.info("Sending to %s..." % url)
            response = net.read(url, ("%s\n%s" % (str(subject), str(message['body']))).encode('utf-8'))
            log.info("--> %s" % response)
        else:
            # unpack the ambit zip and post each sample (to ambit or to ambit_geo)
            log.info("--> %s attachments" % len(message['attachments']))
            for attachment in message['attachments']:
                try:
                    path = os.path.join(os.path.dirname(__file__), "..", "uploads", "%s-%s_%s" % (util.timestamp(), m, attachment['filename'].lower()))
                    def write_file():
                        with open(path, 'wb') as f:
                            f.write(attachment['data'])                    
                    if path[-3:] != "zip":
                        log.info("--> skipping non-zip file %s" % path)
                        continue
                    write_file()
                    if zipfile.is_zipfile(path) is False:
                        log.warning("--> zip file is corrupt %s" % path)
                        continue
                    p = path[:-4]
                    os.mkdir(p)
                    with zipfile.ZipFile(path, 'r') as archive:
                        archive.extractall(p)
                        log.info("--> zip file extracted")
                        def traverse(pd):
                            log.info("Checking %s..." % pd)
                            for i, filename in enumerate(os.listdir(pd)):
                                if filename[0] == ".":
                                    continue
                                elif os.path.isdir(os.path.join(pd, filename)):
                                    traverse(os.path.join(pd, filename))
                                elif filename[-3:] == "xml":
                                    try:
                                        log.info("Reading %s..." % os.path.join(pd, filename))
                                        with open(os.path.join(pd, filename)) as f:
                                            content = f.read()        
                                    except Exception as e:
                                        log.error("Could not read file: %s" % log.exc(e))
                                    else:
                                        try:
                                            log.info("Parsing...")
                                            data = xmltodict.parse(content)
                                            # log.debug(json.dumps(data, indent=4))
                                            serial_number = data['sml']['DeviceLog']['Device']['SerialNumber']
                                            try:
                                                member = config['ambits'][serial_number]
                                            except:
                                                log.warning("Ambit serial number not linked to a Member")
                                                member = serial_number
                                            log.info("Member: %s" % member)
                                            samples = data['sml']['DeviceLog']['Samples']['Sample']
                                            for s, sample in enumerate(samples):            
                                                sample['Member'] = member
                                                if 'Satellites' in sample:  # ingest satellite location data                    
                                                    try:
                                                        url = "%s/ingest/ambit_geo" % config['url']
                                                        log.info("Sending to %s..." % url)
                                                        response = net.read(url, str(json.dumps(sample)).encode('utf-8'))
                                                        log.info("--> %s" % response)                                                        
                                                    except Exception as e:
                                                        log.error(log.exc(e))
                                                elif 'VerticalSpeed' in sample: # ingest energy data sample 
                                                    try:
                                                        url = "%s/ingest/ambit" % config['url']
                                                        log.info("Sending to %s..." % url)
                                                        response = net.read(url, str(json.dumps(sample)).encode('utf-8'))
                                                        log.info("--> %s" % response)
                                                    except Exception as e:
                                                        log.error(log.exc(e))
                                        except Exception as e:
                                            log.error("Parsing error: %s" % log.exc(e))
                                else:
                                    log.warning("--> unknown file type %s, skipping..." % filename)
                        traverse(p)

                except Exception as e:
                    log.error(log.exc(e))

main()
