#!/bin/bash

today="$(date +'%m%d%Y')"

if [ ! -d '/Users/elleryroyston/Desktop/${today}' ]; then
   mkdir /Users/elleryroyston/Desktop/${today}
fi 

todaysDir="/Users/elleryroyston/Desktop/${today}"

#1 black cam - 10.5.5.8

ping -c 5 10.5.5.8>>/dev/null

if [ $? -eq 0 ]; then
	echo "Cam1 reachable"
	#turn it on
	curl "http://10.5.5.8/bacpac/PW?t=hudsuckerb1&p=%01"
	sleep 8
	#make sure we're in photo mode
	curl "http://10.5.5.8/camera/CM?t=hudsuckerb1&p=%01"
	sleep 2
    #take a picture
	curl "http://10.5.5.8/bacpac/SH?t=hudsuckerb1&p=%01"
	sleep 8
	curl http://10.5.5.8:8080/videos/DCIM/100GOPRO/ > temp1.html
	files=( $(python test_parser.py temp1.html | grep JPG) )
	for i in "${files[@]}"
	do
		:
		fileN="${i%.*}"
		timestamp="$(date +'%H%M%S')"
		if (ls $todaysDir | grep --quiet ${fileN}); then
			echo "File exists, will not download"
		else	
		    curl "http://10.5.5.8:8080/videos/DCIM/100GOPRO/${i}" > "${todaysDir}/${fileN}_${timestamp}_left.jpg"
		fi
	done
	rm temp1.html
	#turn it off 
	curl "http://10.5.5.8/bacpac/PW?t=hudsuckerb1&p=%00"
else 
	echo "Could not reach cam1"
fi 

#2 white cam - 10.5.5.9

ping -I wlan1 -c 5 10.5.5.9>>/dev/null

if [ $? -eq 0 ]; then
	echo "Cam1 reachable"
	#turn it on
	curl --interface wlan1 "http://10.5.5.9/bacpac/PW?t=hudsuckerw1&p=%01"
	sleep 8
	#make sure we're in photo mode
	curl --interface wlan1 "http://10.5.5.9/camera/CM?t=hudsuckerw1&p=%01"
	sleep 2
    #take a picture
	curl --interface wlan1 "http://10.5.5.9/bacpac/SH?t=hudsuckerw1&p=%01"
	sleep 8
	curl --interface wlan1 http://10.5.5.9:8080/videos/DCIM/100GOPRO/ > temp2.html
	files=( $(python test_parser.py temp2.html | grep JPG) )
	for i in "${files[@]}"
	do
		:
		fileN="${i%.*}"
		timestamp="$(date +'%H%M%S')"
		if (ls $todaysDir | grep --quiet ${fileN}); then
			echo "File exists, will not download"
		else	
		    curl --interface wlan1 "http://10.5.5.9:8080/videos/DCIM/100GOPRO/${i}" > "${todaysDir}/${fileN}_${timestamp}_center.jpg"
		fi
	done
	rm temp2.html
	#turn it off 
	curl --interface wlan1 "http://10.5.5.9/bacpac/PW?t=hudsuckerw1&p=%00"
else 
	echo "Could not reach cam1"
fi 

#3 black cam - 10.5.5.10

ping -I wlan2 -c 5 10.5.5.10>>/dev/null

if [ $? -eq 0 ]; then
	echo "Cam1 reachable"
	#turn it on
	curl --interface wlan2 "http://10.5.5.10/bacpac/PW?t=hudsuckerb2&p=%01"
	sleep 8
	#make sure we're in photo mode
	curl --interface wlan2 "http://10.5.5.10/camera/CM?t=hudsuckerb2&p=%01"
    #take a picture
    sleep2
	curl --interface wlan2 "http://10.5.5.10/bacpac/SH?t=hudsuckerb2&p=%01"
	sleep 8
	curl --interface wlan2 http://10.5.5.10:8080/videos/DCIM/100GOPRO/ > temp3.html
	files=( $(python test_parser.py temp3.html | grep JPG) )
	for i in "${files[@]}"
	do
		:
		fileN="${i%.*}"
		timestamp="$(date +'%H%M%S')"
		if (ls $todaysDir | grep --quiet ${fileN}); then
			echo "File exists, will not download"
		else	
		    curl --interface wlan2 "http://10.5.5.10:8080/videos/DCIM/100GOPRO/${i}" > "${todaysDir}/${fileN}_${timestamp}_right.jpg"
		fi
	done
	rm temp3.html
	#turn it off 
	curl --interface wlan2 "http://10.5.5.10/bacpac/PW?t=hudsuckerb2&p=%00"
else 
	echo "Could not reach cam1"
fi 



#xidel http://10.5.5.9:8080/videos/DCIM/100GOPRO/ -e //a/@href | grep JPG


