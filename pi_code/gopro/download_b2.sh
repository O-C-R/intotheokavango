#!/bin/bash

#cam 3

todaysDir="$(date +'%d%m%y')"

ping -I wlan2 -c 3 10.5.5.10>>/dev/null

if [ $? -eq 0 ]; then
	echo "Cam3 reachable"
	#turn it on
	curl -s --interface wlan2 "http://10.5.5.10/bacpac/PW?t=hudsuckerb2&p=%01"
	sleep 8
	#make sure we're in photo mode
	curl -s --interface wlan2 "http://10.5.5.10/camera/CM?t=hudsuckerb2&p=%01"
        #take a picture
        sleep 2
	curl -s --interface wlan2 "http://10.5.5.10/bacpac/SH?t=hudsuckerb2&p=%01"
	sleep 8 
	curl -s --interface wlan2 http://10.5.5.10:8080/videos/DCIM/100GOPRO/ > temp3.html
	files=( $(python /home/pi/okavango/gopro/html_parse.py temp3.html | grep JPG) )
	for i in "${files[@]}"
	do
		:
		fileN="${i%.*}"
		timestamp="$(date +'%H%M')"
        if [ -e /home/pi/okavango/okanode/public/archive/${todaysDir}/jpg/right ]; then
		   if ( ls /home/pi/okavango/okanode/public/archive/${todaysDir}/jpg/right/${fileN}* >/dev/null 2>&1 ) || ( ls /home/pi/okavango/okanode/public/uploads/jpg/right/${fileN}* >/dev/null 2>&1 ); then
			  echo "File exists, will not download"
		   else
              curl -s --interface wlan2 "http://10.5.5.10:8080/videos/DCIM/100GOPRO/${i}" > "/home/pi/okavango/okanode/public/uploads/jpg/right/${fileN}_${todaysDir}${timestamp}.jpg"
           fi
		else
		   if [ ls /home/pi/okavango/okanode/public/uploads/jpg/right | grep --quiet ${fileN} ]; then
              echo "File already queued to upload"
           else	
		      curl -s --interface wlan2 "http://10.5.5.10:8080/videos/DCIM/100GOPRO/${i}" > "/home/pi/okavango/okanode/public/uploads/jpg/right/${fileN}_${todaysDir}${timestamp}.jpg"
           fi
		fi
	done
	rm temp3.html
	#turn it off 
	curl -s --interface wlan2 "http://10.5.5.10/bacpac/PW?t=hudsuckerb2&p=%00"
else 
	echo "Could not reach cam3"
fi 