#!/bin/bash

#cam 2

todaysDir="$(date +'%d%m%y')"

ping -I wlan1 -c 3 10.5.5.9>>/dev/null

if [ $? -eq 0 ]; then
	echo "Cam2 reachable"
	#turn it on
	curl -s --interface wlan1 "http://10.5.5.9/bacpac/PW?t=hudsuckerw1&p=%01"
	sleep 8
	#make sure we're in photo mode
	curl -s  --interface wlan1 "http://10.5.5.9/camera/CM?t=hudsuckerw1&p=%01"
	sleep 2
    #take a picture
	curl -s  --interface wlan1 "http://10.5.5.9/bacpac/SH?t=hudsuckerw1&p=%01"
	sleep 8
	curl -s --interface wlan1 http://10.5.5.9:8080/videos/DCIM/100GOPRO/ > temp2.html
	files=( $(python /home/pi/okavango/gopro/html_parse.py temp2.html | grep JPG) )
	for i in "${files[@]}"
	do
		:
		fileN="${i%.*}"
		timestamp="$(date +'%H%M')"
		if [ -e /home/pi/okavango/okanode/public/archive/${todaysDir}/jpg/center ]; then 
			if ( ls /home/pi/okavango/okanode/public/archive/${todaysDir}/jpg/center/${fileN}* >/dev/null 2>&1 ) || ( ls /home/pi/okavango/okanode/public/uploads/jpg/center/${fileN}* >/dev/null 2>&1 ); then
				echo "File exists, will not download"
			else
				curl -s --interface wlan1 "http://10.5.5.9:8080/videos/DCIM/100GOPRO/${i}" > "/home/pi/okavango/okanode/public/uploads/jpg/center/${fileN}_${todaysDir}${timestamp}.jpg"
			fi
		else
			if [ ls /home/pi/okavango/okanode/public/uploads/jpg | grep --quiet ${fileN}center ]; then
				echo "File already queued to upload"
			else	
				curl -s --interface wlan1 "http://10.5.5.9:8080/videos/DCIM/100GOPRO/${i}" > "/home/pi/okavango/okanode/public/uploads/jpg/center/${fileN}_${todaysDir}${timestamp}.jpg"
			fi
		fi
	done
	rm temp2.html
	#turn it off 
	curl -s --interface wlan1 "http://10.5.5.9/bacpac/PW?t=hudsuckerw1&p=%00"
else 
	echo "Could not reach cam2"
fi 