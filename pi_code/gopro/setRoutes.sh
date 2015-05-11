# !/bin/bash

#/etc/init.d/networking stop
#/etc/init.d/networking start

#cam 1 - w1

ip1="$(ifconfig wlan1 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
if [ -n "$ip1" ]; then
	ip route add 10.5.5.9 via ${ip1} dev wlan1
	echo "Route to Cam 1 added"
else 	
	sudo ifdown wlan1
	sudo ifup wlan1
	ip1="$(ifconfig wlan1 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
	if [ -n "$ip1" ]; then
		ip route add 10.5.5.9 via ${ip1} dev wlan1
		echo "Route to Cam 1 added"
	else
		echo "Could not reach Cam 1"
	fi
fi

#cam 2 - b2

ip2="$(ifconfig wlan2 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
if [ -n "$ip2" ]; then
	ip route add 10.5.5.9 via ${ip2} dev wlan2
	echo "Route to Cam 2 added"
else 	
	sudo ifdown wlan2
	sudo ifup wlan2
	ip1="$(ifconfig wlan2 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
	if [ -n "$ip2" ]; then
		ip route add 10.5.5.9 via ${ip2} dev wlan2
		echo "Route to Cam 2 added"
	else
		echo "Could not reach Cam 2"
	fi
fi

#cam 3 - b1

ip3="$(ifconfig wlan3 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
if [ -n "$ip3" ]; then
	ip route add 10.5.5.9 via ${ip3} dev wlan3
	echo "Route to Cam 3 added"
else 	
	sudo ifdown wlan3
	sudo ifup wlan3
	ip1="$(ifconfig wlan3 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')"
	if [ -n "$ip3" ]; then
		ip route add 10.5.5.9 via ${ip3} dev wlan3
		echo "Route to Cam 3 added"
	else
		echo "Could not reach Cam 3"
	fi
fi

service avahi-daemon restart
