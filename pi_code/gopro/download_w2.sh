#!/bin/bash

#2 white cam - 10.5.5.9

todaysDir="$(date +'%d%m%y')"

ping -c 3 -I wlan2 10.5.5.9>>/dev/null

if [ $? -eq 0 ]; then
	echo "Cam2 reachable"
	#turn it on
	curl -s --interface wlan2 "http://10.5.5.9/bacpac/PW?t=hudsuckerw2&p=%01"
	sleep 8
	#make sure we're in photo mode
	curl -s --interface wlan2 "http://10.5.5.9/camera/CM?t=hudsuckerw2&p=%01"
	sleep 2
        #take a picture
	curl -s --interface wlan2 "http://10.5.5.9/bacpac/SH?t=hudsuckerw2&p=%01"
	sleep 8
	curl -s --interface wlan2 http://10.5.5.9:8080/videos/DCIM/100GOPRO/ > temp1.html
	files=( $(python /home/pi/okavango/gopro/html_parse.py temp1.html | grep JPG) )
	for i in "${files[@]}"
	do
		:
		fileN="${i%.*}"
		echo "${fileN}"
		timestamp="$(date +'%H%M')"
		if [ -e /home/pi/okavango/okanode/public/archive/${todaysDir}/jpg/gopro ]; then 
                   if  ls /home/pi/okavango/okanode/public/uploads/jpg/gopro/${fileN}left* 1> /dev/null 2>&1 ; then
                       echo  "File exists, will not download"
		   elif ls /home/pi/okavango/okanode/public/archive/${todaysDir}/jpg/gopro/${fileN}left* 1> /dev/null 2>&1 ; then
                       echo  "File exists, will not download"
                   else
                       curl -s --interface wlan2 "http://10.5.5.9:8080/videos/DCIM/100GOPRO/${i}" > "/home/pi/okavango/okanode/public/uploads/jpg/gopro/${fileN}left_${todaysDir}${timestamp}.jpg"
		       echo "Downloading file"
                   fi
               else
                   if ls /home/pi/okavango/okanode/public/uploads/jpg/gopro/${fileN}left* 1> /dev/null 2>&1; then
                      echo "File queued to upload"
                   else
                      curl -s --interface wlan2 "http://10.5.5.9:8080/videos/DCIM/100GOPRO/${i}" > "/home/pi/okavango/okanode/public/uploads/jpg/gopro/${fileN}left_${todaysDir}${timestamp}.jpg"
		      echo "Downloading file"
                   fi
               fi
	done
	rm temp1.html
	#turn it off 
	curl -s --interface wlan2 "http://10.5.5.9/bacpac/PW?t=hudsuckerw2&p=%00"
else 
	echo "Could not reach cam1"
fi 
